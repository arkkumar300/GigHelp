package com.gighelp
import android.os.Build
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "GigHelp"
  override fun onCreate(savedInstanceState: Bundle?) {
  //    SplashScreen.show(this);  // here
        super.onCreate(null)

//      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//          startForegroundService(Intent(this, LocationService::class.java))
//      } else {
//          startService(Intent(this, LocationService::class.java))
//      }
    }
  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
