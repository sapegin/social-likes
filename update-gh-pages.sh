#!/bin/bash

echo "Updating Social Likes on gh-pages…"

pushd src/
grunt build
popd
cp social-likes.css ../social-likes_gh-pages/src/
cp social-likes.min.js ../social-likes_gh-pages/src/
cp src/social-likes.js ../social-likes_gh-pages/src/
pushd ../social-likes_gh-pages/
git commit -m "Update Social Likes." src
git push
popd