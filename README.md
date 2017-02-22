# cordova-plugin-extrafiles

Cordova/Phonegap plugin to copy(move resources at build time.

Will not overwrite existing files, one must manually remove destination files
in order to update them.

## Example config.xml

```xml
  <resource dest="platforms/android/res/drawable">
      <resource src="platforms/android/assets/www/notification.png" action="move" />
  </resource> 
```
