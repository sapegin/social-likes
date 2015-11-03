#!/bin/bash

echo "Updating Social Likes on gh-pages…"

grunt build
cp ../social-likes_flat.css ../../social-likes_gh-pages/src/
cp ../social-likes_classic.css ../../social-likes_gh-pages/src/
cp ../social-likes_birman.css ../../social-likes_gh-pages/src/
cp ../social-likes.min.js ../../social-likes_gh-pages/src/
cp ../bower.json ../../social-likes_gh-pages/src/
cp social-likes.js ../../social-likes_gh-pages/src/
pushd ../../social-likes_gh-pages/
grunt replace:version
git commit -m "Update Social Likes." src index.html ru/index.html
git push
popd