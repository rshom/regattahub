# Minimum Viable Product Base

For my personal use. Professional follow through is important. The point of this repo is to have all the follow through done at the start of the project. This way, I can just insert my project into my base and I'm ready to go.

## Start TODO

 - [ ] clone this repo
 - [ ] connect repo to equivalent repo on github
 - [ ] modify _config.yl
 - [ ] replace README.md with a custom one

## Before Launch

 - [ ] email list
 - [ ] domain name
 - [ ] about page

## Features

### Basic template

Very simple bootstrap with fixed header. Credit goes to [Bootstrap Zero](https://www.bootstrapzero.com/bootstrap-template/basic). Put any edits in css/styles.css. It already auto adjusts to different sized devices, but always test that functionality to be sure.

You can generate other pages as necessary. Just make sure they have front matter for jekyll. When you add a page, you will have to add a menu link to it at _layouts/default.html

### Index

Put the actual project here. 

### Contact

Basic email contact form and contact information. Add more information if you want more than just email. Form runs through formspree.io and is all set up. You just have to confirm your email address. I recommend setting up a new email and having it forward for any test websites.

Contact page include few hidden attributes that help with email managment
 - _gotcha is a honeypot for spam
 - _replyto so emails can be replied directly to
 - _subject to add something about it coming from the website

Contact also includes a thanks page that the user is forwarded to after attempting to contact.

### About

Fill in a description of your team and the project here.

### Blog

The link to blog is commented out since most projects won't need it. However, if you need it, just uncomment the line in _layouts/default.html and start posting in _posts

### RSS feed

### XML sitemap

### Google analytics

### README.md

rename newREADME.md to README.md and fill in some basics