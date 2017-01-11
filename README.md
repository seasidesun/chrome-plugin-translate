### A Chrome Plugin For Translate

#### Default Hotkey: `Shift+Alt+Y`

#### Tip for chrome plugin develop

If the plugin open the popup with delay, try to add the file: `backgroud.html`, and upadte the `manifest.json`

```
//manifest.json

...
"background": {
    "page": "background.html",
    "persistent": true
},
...
```
