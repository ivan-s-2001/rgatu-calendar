package ru.rgatu.parttime;

import java.io.*;
import java.util.*;
import java.util.regex.*;
import java.util.zip.*;
import java.security.MessageDigest;
import javax.xml.parsers.*;
import org.w3c.dom.*;

/** Reads the university's date / pair / entity matrix without third-party libraries. */
public final class XlsxReader {
    private static final long MAX_ZIP_BYTES = 64L * 1024 * 1024;
    private static final Pattern DATE = Pattern.compile("(\\d{1,2})[./](\\d{1,2})[./](\\d{2,4})");
    private static final Pattern PAIR = Pattern.compile("^(\\d{1,2})\\s*(?:пара|пары|п\\.?)(?:\\s.*)?$", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE);

    public static String read(InputStream input, String filename) throws Exception {
        Map<String, byte[]> files = new HashMap<>();
        long total = 0;
        int count = 0;
        try (ZipInputStream zip = new ZipInputStream(input)) {
            ZipEntry entry;
            byte[] buffer = new byte[16384];
            while ((entry = zip.getNextEntry()) != null) {
                if (++count > 2048) throw new IOException("В файле слишком много элементов.");
                ByteArrayOutputStream out = new ByteArrayOutputStream();
                int n;
                while ((n = zip.read(buffer)) != -1) {
                    total += n;
                    if (total > MAX_ZIP_BYTES) throw new IOException("Excel слишком большой. Максимум 64 МБ после распаковки.");
                    out.write(buffer, 0, n);
                }
                if (!entry.isDirectory() && entry.getName().startsWith("xl/") && entry.getName().endsWith(".xml"))
                    files.put(entry.getName(), out.toByteArray());
                if (entry.getName().equals("xl/_rels/workbook.xml.rels")) files.put(entry.getName(), out.toByteArray());
            }
        }
        Document workbook = xml(required(files, "xl/workbook.xml"));
        Map<String, String> relationships = new HashMap<>();
        for (Element e : elements(xml(required(files, "xl/_rels/workbook.xml.rels")), "Relationship"))
            relationships.put(e.getAttribute("Id"), e.getAttribute("Target"));
        boolean date1904 = false;
        List<Element> properties = elements(workbook, "workbookPr");
        if (!properties.isEmpty()) date1904 = properties.get(0).getAttribute("date1904").matches("1|true");
        List<String> shared = new ArrayList<>();
        if (files.containsKey("xl/sharedStrings.xml")) {
            for (Element si : elements(xml(files.get("xl/sharedStrings.xml")), "si")) {
                StringBuilder value = new StringBuilder();
                for (Element t : elements(si, "t")) value.append(t.getTextContent());
                shared.add(value.toString());
            }
        }
        List<String> sheets = new ArrayList<>();
        int sheetIndex = 0, recordCount = 0;
        for (Element sheet : elements(workbook, "sheet")) {
            String title = sheet.getAttribute("name");
            String rid = sheet.getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships", "id");
            String target = relationships.get(rid);
            if (target == null) continue;
            String path = target.startsWith("/") ? target.substring(1) : "xl/" + target;
            Document doc = xml(required(files, path));
            TreeMap<Integer, TreeMap<Integer, String>> rows = new TreeMap<>();
            for (Element row : elements(doc, "row")) {
                int rn = Integer.parseInt(row.getAttribute("r"));
                if (rn > 20000) throw new IOException("В расписании больше 20 000 строк.");
                TreeMap<Integer, String> cells = new TreeMap<>();
                for (Element cell : elements(row, "c")) {
                    int col = column(cell.getAttribute("r"));
                    if (col > 2000) throw new IOException("В расписании больше 2 000 столбцов.");
                    String value = text(cell, "v");
                    if (cell.getAttribute("t").equals("s")) {
                        int index = Integer.parseInt(value);
                        if (index < 0 || index >= shared.size()) throw new IOException("Повреждён список строк Excel.");
                        value = shared.get(index);
                    } else if (cell.getAttribute("t").equals("inlineStr")) {
                        StringBuilder inline = new StringBuilder();
                        for (Element t : elements(cell, "t")) inline.append(t.getTextContent());
                        value = inline.toString();
                    }
                    if (!value.trim().isEmpty()) cells.put(col, value);
                }
                rows.put(rn, cells);
            }
            // Expand merged ranges so a lesson spanning several pairs remains visible.
            for (Element merge : elements(doc, "mergeCell")) {
                String[] bounds = merge.getAttribute("ref").split(":");
                if (bounds.length != 2) continue;
                int c1 = column(bounds[0]), c2 = column(bounds[1]);
                int r1 = rowNumber(bounds[0]), r2 = rowNumber(bounds[1]);
                if (r2 > 20000 || c2 > 2000 || (long)(r2-r1+1)*(c2-c1+1) > 50000)
                    throw new IOException("Слишком большая объединённая область Excel.");
                TreeMap<Integer, String> origin = rows.get(r1);
                String value = origin == null ? null : origin.get(c1);
                if (value == null) continue;
                for (int r = r1; r <= r2; r++) {
                    if (!rows.containsKey(r)) rows.put(r, new TreeMap<Integer, String>());
                    for (int c = c1; c <= c2; c++) if (!rows.get(r).containsKey(c)) rows.get(r).put(c, value);
                }
            }
            int headerRow = -1;
            String kind = "";
            for (Map.Entry<Integer, TreeMap<Integer, String>> row : rows.entrySet()) {
                if (row.getKey() > 80) break;
                String a = row.getValue().get(1), b = row.getValue().get(2);
                if (a == null || b == null || !a.toLowerCase(Locale.ROOT).contains("дат")) continue;
                String label = b.toLowerCase(Locale.ROOT);
                if (label.contains("групп")) kind = "groups";
                else if (label.contains("преподавател")) kind = "teachers";
                else if (label.contains("помещен") || label.contains("аудитор")) kind = "rooms";
                if (!kind.isEmpty()) { headerRow = row.getKey(); break; }
            }
            if (headerRow < 0) continue;
            String sid = "s" + sheetIndex++;
            TreeMap<Integer, String> headers = rows.get(headerRow);
            Map<Integer, List<String>> records = new LinkedHashMap<>();
            for (Integer col : headers.keySet()) if (col > 2) records.put(col, new ArrayList<String>());
            TreeSet<String> dates = new TreeSet<>();
            String currentDate = null;
            for (Map.Entry<Integer, TreeMap<Integer, String>> row : rows.entrySet()) {
                if (row.getKey() <= headerRow) continue;
                TreeMap<Integer, String> cells = row.getValue();
                if (cells.containsKey(1)) currentDate = date(cells.get(1), date1904);
                if (currentDate == null) continue;
                dates.add(currentDate);
                String label = cells.get(2);
                if (label == null) continue;
                Matcher matcher = PAIR.matcher(label.trim());
                if (!matcher.matches()) continue;
                int pair = Integer.parseInt(matcher.group(1));
                if (pair < 1 || pair > 20) continue;
                for (Map.Entry<Integer, List<String>> entity : records.entrySet()) {
                    String value = cells.get(entity.getKey());
                    if (value == null || value.trim().isEmpty()) continue;
                    entity.getValue().add("{\"date\":" + quote(currentDate) + ",\"pair\":" + pair
                        + ",\"text\":" + quote(value) + ",\"cell\":" + quote(columnName(entity.getKey()) + row.getKey()) + "}");
                    recordCount++;
                }
            }
            List<String> entities = new ArrayList<>();
            for (Map.Entry<Integer, List<String>> entity : records.entrySet())
                entities.add("{\"id\":" + quote(entityId(kind, headers.get(entity.getKey()).trim())) + ",\"name\":" + quote(headers.get(entity.getKey()).trim())
                    + ",\"entries\":[" + join(entity.getValue()) + "]}");
            List<String> dateStrings = new ArrayList<>();
            for (String d : dates) dateStrings.add(quote(d));
            sheets.add("{\"id\":" + quote(sid) + ",\"title\":" + quote(title) + ",\"kind\":" + quote(kind)
                + ",\"dates\":[" + join(dateStrings) + "],\"entities\":[" + join(entities) + "]}");
        }
        if (sheets.isEmpty() || recordCount == 0)
            throw new IOException("Не найдено расписание. Нужны столбцы «Дата», «Группа / Преподаватель / Помещение» и строки «1 пара», «2 пара».");
        return "{\"schemaVersion\":1,\"source\":{\"name\":" + quote(filename) + "},\"sheets\":[" + join(sheets) + "]}";
    }

    private static byte[] required(Map<String, byte[]> files, String path) throws IOException {
        byte[] bytes = files.get(path);
        if (bytes == null) throw new IOException("Это не поддерживаемый XLSX-файл: отсутствует " + path);
        return bytes;
    }
    private static Document xml(byte[] bytes) throws Exception {
        DocumentBuilderFactory f = DocumentBuilderFactory.newInstance();
        f.setNamespaceAware(true);
        try { f.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true); } catch (Exception ignored) {}
        try { f.setFeature("http://xml.org/sax/features/external-general-entities", false); } catch (Exception ignored) {}
        try { f.setFeature("http://xml.org/sax/features/external-parameter-entities", false); } catch (Exception ignored) {}
        if (new String(bytes, "UTF-8").toUpperCase(Locale.ROOT).contains("<!DOCTYPE")) throw new IOException("XML с DTD не поддерживается.");
        return f.newDocumentBuilder().parse(new ByteArrayInputStream(bytes));
    }
    private static List<Element> elements(Node node, String name) {
        NodeList list = node instanceof Document ? ((Document) node).getElementsByTagNameNS("*", name)
                : ((Element) node).getElementsByTagNameNS("*", name);
        List<Element> result = new ArrayList<>();
        for (int i = 0; i < list.getLength(); i++) result.add((Element) list.item(i));
        return result;
    }
    private static String text(Element node, String name) { List<Element> list = elements(node, name); return list.isEmpty() ? "" : list.get(0).getTextContent(); }
    private static int column(String ref) {
        int result = 0;
        for (int i = 0; i < ref.length(); i++) { char c = ref.charAt(i); if (c < 'A' || c > 'Z') break; result = result * 26 + c - 'A' + 1; }
        return result;
    }
    private static int rowNumber(String ref) { return Integer.parseInt(ref.replaceAll("[^0-9]", "")); }
    private static String columnName(int col) { StringBuilder b = new StringBuilder(); while (col > 0) { col--; b.insert(0, (char) ('A' + col % 26)); col /= 26; } return b.toString(); }
    private static String date(String value, boolean date1904) {
        Matcher m = DATE.matcher(value.trim());
        int year, month, day;
        if (m.matches()) {
            day = Integer.parseInt(m.group(1)); month = Integer.parseInt(m.group(2)); year = Integer.parseInt(m.group(3));
            if (year < 100) year += 2000;
        } else {
            try {
                double serial = Double.parseDouble(value.trim());
                if (serial < 1 || serial > 90000) return null;
                Calendar c = new GregorianCalendar(TimeZone.getTimeZone("UTC"));
                c.clear(); c.set(date1904 ? 1904 : 1899, date1904 ? 0 : 11, date1904 ? 1 : 30);
                c.add(Calendar.DAY_OF_MONTH, (int) Math.floor(serial));
                year = c.get(Calendar.YEAR); month = c.get(Calendar.MONTH) + 1; day = c.get(Calendar.DAY_OF_MONTH);
            } catch (NumberFormatException e) { return null; }
        }
        try {
            Calendar c = new GregorianCalendar(TimeZone.getTimeZone("UTC")); c.clear(); c.setLenient(false); c.set(year, month-1, day); c.getTime();
        } catch (IllegalArgumentException e) { return null; }
        return String.format(Locale.ROOT, "%04d-%02d-%02d", year, month, day);
    }
    public static String quote(String value) {
        StringBuilder b = new StringBuilder("\"");
        for (int i = 0; i < value.length(); i++) {
            char c = value.charAt(i);
            if (c == '"' || c == '\\') b.append('\\').append(c);
            else if (c < 32) b.append(String.format(Locale.ROOT, "\\u%04x", (int) c));
            else b.append(c);
        }
        return b.append('"').toString();
    }
    private static String join(Collection<String> items) { StringBuilder b = new StringBuilder(); for (String s : items) { if (b.length() > 0) b.append(','); b.append(s); } return b.toString(); }
    private static String entityId(String kind, String name) throws Exception {
        byte[] digest = MessageDigest.getInstance("SHA-256").digest((kind + "|" + name).getBytes("UTF-8"));
        StringBuilder id = new StringBuilder(kind + "-");
        for (int i=0;i<12;i++) id.append(String.format(Locale.ROOT,"%02x",digest[i]&255));
        return id.toString();
    }
    public static void main(String[] args) throws Exception {
        try (FileInputStream in = new FileInputStream(args[0])) { System.out.print(read(in, args.length > 1 ? args[1] : new File(args[0]).getName())); }
    }
}
