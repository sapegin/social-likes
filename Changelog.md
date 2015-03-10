### 2015-03-10 v3.0.14

* Revert counters changes from previous release because 
* Disable Odnoklassniki counter on HTTPS because of redirect to HTTP.
* Show counters after 10 sec even if they aren’t ready (instead of waiting for browser’s 30 sec timeout).
* Don’t add a colon to tweet if it ends on a question mark (by [@richardwestenra](https://github.com/richardwestenra)).

### 2015-02-16 v3.0.13

* Add HTTPS support to Google+ using Yandex as proxy (by [@im-denisenko](https://github.com/im-denisenko)).
* Add HTTPS support to Odnoklassniki using Yandex as proxy (by [@im-denisenko](https://github.com/im-denisenko)).

### 2015-01-19 v3.0.12

* Remove non-numerical characters from counters before conversion to number. Fixes Google+ counter in rare cases (#105).
* Try to fix Odnoklassniki counter on mobiles (#94).
* `$.click` -> `$.on` (do not depend on jQuery’s event/alias module).

### 2015-01-13 v3.0.11

* Update Odnoklassniki popup URL to prevent redirect.
* Always use HTTPS for VK counter (HTTP causes redirect).

### 2014-12-11 v3.0.10

* Odnoklassniki counter works via HTTPS (again) (by [@zipp3r](https://github.com/zipp3r)).

### 2014-11-20 v3.0.9

* Do not request Odnoklassniki counter via HTTPS.
* Fix counters after reinitialization of the plugin with the same URL.

### 2014-11-20 v3.0.8

* Revert older Odnoklassniki counter API (doesn’t work via HTTPS but at least works via HTTP).

### 2014-11-06 v3.0.7

* Odnoklassniki counter works via HTTPS (by [@zipp3r](https://github.com/zipp3r)).
* Fix bug when counters don’t show up on HTTPS pages.

### 2014-05-13 v3.0.4

* Tweak single button popup fade animation.
* Flat skin: fix icons on Windows (#69).
* Flat skin: fix counters positons in vertical mode in Firefox.
* Birman skin: fix icon positions in single button mode in Firefox.
* Classic skin: fix gradients in Firefox.

### 2014-04-10 v3.0.3

* Always use HTTPS for Twitter (#58).
* Disable Google+ counter on HTTPS pages (#58).
* Fix paddings on single button popup in Birman skin in Safari.
* Fix height of single button in Flat skin.
* Single button clicks toggles popup instead of just opening.
* Now you can user data-service attribute instead of class name (by [@fliptheweb](https://github.com/fliptheweb)).

### 2014-02-12 v3.0.2

* `popup_opened` and `popup_closed` events.
* `forceUpdate` option.
* Fix `class` error in IE.
* Tweak flat skin.

### 2014-02-05 v3.0.1

* Ability to dynamically update URL.
* Detect HTTPS.
* Use HTTPS for Facebook.
* New single button popups.
* Skins tweaks.

### 2014-02-03 v3.0.0

* New skins: Flat and Birman.
* `zeroes` option.
* `ready.social-likes` event.
* `counter.social-likes` fires on zeroes too.
* Reduce flickering couters on page load.
* Ability to pass options to `$.socialLikes()` jQuery method (by [@albburtsev](https://github.com/albburtsev)).
* Internal counter for Google+ button (uses Yandex).
* Remove search links on counters.
* Remove LiveJournal button.
* Remove IE7 support.
* Lots other improvements and refactorings.

### 2013-12-23 v2.0.13

* `searchUrl` option (by [@pivchanskiy](https://github.com/pivchanskiy)).
* Imporove `socialLikesButtons` object handling (by [@ironlion](https://github.com/ironlion)).

### 2013-08-26 v2.0.12

* Icons only mode (by [@albburtsev](https://github.com/albburtsev)).

### 2013-08-08 v2.0.11

* `counter.social-likes` event (#32).

### 2013-06-20 v2.0.10

* Prevent layout breaking without labels (#31).

### 2013-04-23 v2.0.8

* New Odnoklassniki API.
* Improved manual initialization.
* Compress CSS with CSSO.

### 2013-02-05 v2.0.7

* `data-title` and `data-url` attributes (by [@jalkoby](https://github.com/jalkoby]).
* Pinterest button (mostly by [@jalkoby](https://github.com/jalkoby]).
* Code button removed.
