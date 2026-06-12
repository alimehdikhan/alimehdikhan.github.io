#!/bin/bash
git filter-branch --force --index-filter 'git rm -rf --cached --ignore-unmatch node_modules .next out dist .cache' --prune-empty HEAD
