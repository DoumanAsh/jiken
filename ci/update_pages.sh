#!/bin/bash
REPO=`git config remote.origin.url`
SHA=`git log -1 --format="%s(%h %cd)" --date=short`
COMMIT_AUTHOR_EMAIL=`git --no-pager log -1 --pretty=format:"%ae" HEAD`

git clone $REPO html/

cd html/

git checkout gh-pages || git checkout --orphan gh-pages

ls

find . -name "_*.*" | xargs rm -rf
find . -name ".*.*" | xargs rm -rf
rm -rf *
rm .flowconfig .babelrc .gitignore

cd ../

npm run docs

cd html

git status

git config user.name "Travis CI"
git config user.email "$COMMIT_AUTHOR_EMAIL"
echo "https://${GIT_TOKEN}:x-oauth-basic@github.com\n" > ~/.git-credentials
git config remote.origin.url "https://${GIT_TOKEN}@github.com/${TRAVIS_REPO_SLUG}.git"

git add --all .
git commit -m "Auto-update" -m "Commit: ${SHA}"
git push origin HEAD