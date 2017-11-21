# 3.1.3 - 2017-11-21

* **Fixed**: Disable non-working Google+ counter (#210 by @apotheosis91).
* **Fixed**: `updateCounter`: append counter only once (#209 by @RunnX).

# 3.1.2 - 2016-12-02

* **Fixed**: popup position on dual-screen setups (#190 by @mshevtsov).

# 3.1.1 - 2016-08-19

* **Fixed**: Facebook counter API (#184 by @gldmtr, #186 by @xdimedrolx).
* **Fixed**: ready state check after Twitter counter removal (#182 by @shvetsgroup).
* Allow HTML in button captions (#109 by @thenexus00).

# 3.1.0 - 2016-01-10

* Fix Google+ counter.
* Enable HTTPS for Odnoklassniki.
* `ready.social-likes` now triggered after all counters (#166, by @scream4ik).
* Open all popups with HTTPS.
* Update popup sizes.

3.0.15 was the last version available via Bower. Now Social Likes is available only via npm.

# 3.0.15 - 2015-11-21

* Disable discontinued Twitter button (#147).
* Trigger counter update if number equals zero and zeroes option specified (#151, by @ColCh).

# 3.0.14 - 2015-03-10

* Revert counters changes from previous release because 
* Disable Odnoklassniki counter on HTTPS because of redirect to HTTP.
* Show counters after 10 sec even if they aren’t ready (instead of waiting for browser’s 30 sec timeout).
* Don’t add a colon to tweet if it ends on a question mark (by [@richardwestenra](https://github.com/richardwestenra)).

# 3.0.13 - 2015-02-16

* Add HTTPS support to Google+ using Yandex as proxy (by [@im-denisenko](https://github.com/im-denisenko)).
* Add HTTPS support to Odnoklassniki using Yandex as proxy (by [@im-denisenko](https://github.com/im-denisenko)).

# 3.0.12 - 2015-01-19

* Remove non-numerical characters from counters before conversion to number. Fixes Google+ counter in rare cases (#105).
* Try to fix Odnoklassniki counter on mobiles (#94).
* `$.click` -> `$.on` (do not depend on jQuery’s event/alias module).

# 3.0.11 - 2015-01-13

* Update Odnoklassniki popup URL to prevent redirect.
* Always use HTTPS for VK counter (HTTP causes redirect).

# 3.0.10 - 2014-12-11

* Odnoklassniki counter works via HTTPS (again) (by [@zipp3r](https://github.com/zipp3r)).

# 3.0.9 - 2014-11-20

* Do not request Odnoklassniki counter via HTTPS.
* Fix counters after reinitialization of the plugin with the same URL.

# 3.0.8 - 2014-11-20

* Revert older Odnoklassniki counter API (doesn’t work via HTTPS but at least works via HTTP).

# 3.0.7 - 2014-11-06

* Odnoklassniki counter works via HTTPS (by [@zipp3r](https://github.com/zipp3r)).
* Fix bug when counters don’t show up on HTTPS pages.

# 3.0.4 - 2014-05-13

* Tweak single button popup fade animation.
* Flat skin: fix icons on Windows (#69).
* Flat skin: fix counters positons in vertical mode in Firefox.
* Birman skin: fix icon positions in single button mode in Firefox.
* Classic skin: fix gradients in Firefox.

# 3.0.3 - 2014-04-10

* Always use HTTPS for Twitter (#58).
* Disable Google+ counter on HTTPS pages (#58).
* Fix paddings on single button popup in Birman skin in Safari.
* Fix height of single button in Flat skin.
* Single button clicks toggles popup instead of just opening.
* Now you can user data-service attribute instead of class name (by [@fliptheweb](https://github.com/fliptheweb)).

# 3.0.2 - 2014-02-12

* `popup_opened` and `popup_closed` events.
* `forceUpdate` option.
* Fix `class` error in IE.
* Tweak flat skin.

# 3.0.1 - 2014-02-05

* Ability to dynamically update URL.
* Detect HTTPS.
* Use HTTPS for Facebook.
* New single button popups.
* Skins tweaks.

# 3.0.0 - 2014-02-03

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

# 2.0.13 - 2013-12-23

* `searchUrl` option (by [@pivchanskiy](https://github.com/pivchanskiy)).
* Imporove `socialLikesButtons` object handling (by [@ironlion](https://github.com/ironlion)).

# 2.0.12 - 2013-08-26

* Icons only mode (by [@albburtsev](https://github.com/albburtsev)).

# 2.0.11 - 2013-08-08

* `counter.social-likes` event (#32).

# 2.0.10 - 2013-06-20

* Prevent layout breaking without labels (#31).

# 2.0.8 - 2013-04-23

* New Odnoklassniki API.
* Improved manual initialization.
* Compress CSS with CSSO.

# 2.0.7 - 2013-02-05

* `data-title` and `data-url` attributes (by [@jalkoby](https://github.com/jalkoby]).
* Pinterest button (mostly by [@jalkoby](https://github.com/jalkoby]).
* Code button removed.
