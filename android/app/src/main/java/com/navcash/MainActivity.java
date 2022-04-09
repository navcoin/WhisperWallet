package com.navcash;
import android.os.Bundle;
import org.devio.rn.splashscreen.SplashScreen;
import android.os.Bundle;
import expo.modules.ReactActivityDelegateWrapper;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen; // here

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Whisper Wallet";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
 super.onCreate(savedInstanceState);
//SplashScreen.show(this, R.style.SplashScreenTheme);  
}

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegateWrapper(this,
      new ReactActivityDelegate(this, getMainComponentName()){
        @Override
        protected void loadApp(String appKey) {
          RNBootSplash.init(MainActivity.this); // <- initialize the splash screen
          super.loadApp(appKey);
        }
      }
    );
  }
}
