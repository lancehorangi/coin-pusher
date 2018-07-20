package com.coinpusher;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.rnprogresshud.RNProgressHUDPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.ksyun.media.reactnative.ReactKSYVideoPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.payfubao.RNPayfubaoPackage;
import com.theweflex.react.WeChatPackage;
import com.talkingdata.RNTalkingdataGamePackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.bugly.RNBuglyPackage;
import com.netease.im.RNNeteaseImPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.microsoft.codepush.react.CodePush;
//import com.reactnativenavigation.NavigationReactPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.reactnativenavigation.NavigationApplication;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNProgressHUDPackage(),
            new RNSoundPackage(),
            new ReactKSYVideoPackage(),
            new RNSpinkitPackage(),
            new RNPayfubaoPackage(),
            new WeChatPackage(),
            new RNTalkingdataGamePackage(),
            new RNDeviceInfo(),
            new RNBuglyPackage(),
            new RNNeteaseImPackage(),
            new LinearGradientPackage(),
            new RNGestureHandlerPackage(),
            new VectorIconsPackage(),
            new CodePush(null, getApplicationContext(), BuildConfig.DEBUG)
//            new NavigationReactPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }

  @Override
  public boolean isDebug() {
    // Make sure you are using BuildConfig from your own application
    return BuildConfig.DEBUG;
  }

  @Override
  public List<ReactPackage> createAdditionalReactPackages() {
    return getPackages();
  }

  protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new RNProgressHUDPackage(),
            new RNSoundPackage(),
            new ReactKSYVideoPackage(),
            new RNSpinkitPackage(),
            new RNPayfubaoPackage(),
            new WeChatPackage(),
            new RNTalkingdataGamePackage(),
            new RNDeviceInfo(),
            new RNBuglyPackage(),
            new RNNeteaseImPackage(),
            new LinearGradientPackage(),
            new RNGestureHandlerPackage(),
            new VectorIconsPackage(),
            new CodePush(null, getApplicationContext(), BuildConfig.DEBUG)
//            new NavigationReactPackage()
    );
  }

  @Override
  public String getJSMainModuleName() {
    return "index";
  }
}
