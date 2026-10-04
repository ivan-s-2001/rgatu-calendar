CREATE TABLE IF NOT EXISTS state (id INTEGER PRIMARY KEY CHECK(id=1), revision TEXT, json TEXT, manifest TEXT, status TEXT, source_hash TEXT, lease_until INTEGER NOT NULL DEFAULT 0);
INSERT OR IGNORE INTO state(id,status) VALUES(1,'{}');
CREATE TABLE IF NOT EXISTS revisions (revision TEXT PRIMARY KEY, published_at TEXT NOT NULL, changes TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS subscriptions (id TEXT PRIMARY KEY, transport TEXT NOT NULL CHECK(transport IN ('web','android')), payload TEXT NOT NULL, owner TEXT NOT NULL, created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS outbox (revision TEXT NOT NULL, subscription_id TEXT NOT NULL, payload TEXT NOT NULL, attempts INTEGER NOT NULL DEFAULT 0, next_attempt INTEGER NOT NULL DEFAULT 0, delivered_at INTEGER, PRIMARY KEY(revision,subscription_id));
CREATE INDEX IF NOT EXISTS pending_push ON outbox(delivered_at,next_attempt);
CREATE TABLE IF NOT EXISTS limits (bucket TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS source_snapshots (source TEXT PRIMARY KEY, json TEXT, notices TEXT NOT NULL DEFAULT '[]', source_hash TEXT, checked_at TEXT);
