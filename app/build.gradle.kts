plugins { id("com.android.application") }
val activitySource = file("src/main/java/ru/rgatu/parttime/MainActivity.java").readText()
android {
    namespace = "ru.rgatu.parttime"
    compileSdk = 35
    defaultConfig {
        applicationId = "ru.rgatu.parttime"
        minSdk = 26
        targetSdk = 35
        versionCode = Regex("VERSION_CODE = (\\d+)").find(activitySource)!!.groupValues[1].toInt()
        versionName = Regex("VERSION_NAME = \"([^\"]+)\"").find(activitySource)!!.groupValues[1]
    }
    compileOptions { sourceCompatibility = JavaVersion.VERSION_1_8; targetCompatibility = JavaVersion.VERSION_1_8 }
    val signingPath = System.getenv("RGATU_KEYSTORE")
    if (!signingPath.isNullOrBlank()) {
        signingConfigs {
            create("releaseKey") {
                storeFile = file(signingPath)
                storePassword = System.getenv("RGATU_KEY_PASSWORD")
                keyAlias = "rgatu"
                keyPassword = System.getenv("RGATU_KEY_PASSWORD")
            }
        }
        buildTypes { getByName("release") { signingConfig = signingConfigs.getByName("releaseKey") } }
    }
}
dependencies { implementation("com.google.firebase:firebase-messaging:24.1.2") }
