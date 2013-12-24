#!/bin/bash

echo "Updating Social Likes on gh-pages…"

grunt build
cp ../social-likes_all.css ../../social-likes_gh-pages/src/
cp ../social-likes.css ../../social-likes_gh-pages/src/
cp ../social-likes_classic.css ../../social-likes_gh-pages/src/
cp ../social-likes.min.js ../../social-likes_gh-pages/src/
cp social-likes.js ../../social-likes_gh-pages/src/
rm ../social-likes_all.css
pushd ../../social-likes_gh-pages/
git commit -m "Update Social Likes." src
git push
popd