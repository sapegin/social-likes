#!/bin/bash

echo "Updating Social Likes on gh-pages…"

cp ../dist/social-likes_flat.css ../../social-likes_gh-pages/src/
cp ../dist/social-likes_classic.css ../../social-likes_gh-pages/src/
cp ../dist/social-likes_birman.css ../../social-likes_gh-pages/src/
cp ../dist/social-likes.min.js ../../social-likes_gh-pages/src/
cp ../package.json ../../social-likes_gh-pages/src/
cp ../src/social-likes.js ../../social-likes_gh-pages/src/
pushd ../../social-likes_gh-pages/
npm run replace-version
git commit -m "Update Social Likes." src index.html ru/index.html
git push
popd