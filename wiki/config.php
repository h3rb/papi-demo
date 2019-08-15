<?php /* Configuration file for LionWiki. */

// SETTINGS - default settings, can be overridden in config.php
$WIKI_TITLE = 'API Documentation'; // name of the site

$START_PAGE = 'Welcome'; // Which page should be default (start page)?
$SYNTAX_PAGE = 'http://lionwiki.0o.cz/?page=Syntax+reference';

$DATE_FORMAT = 'm/d/Y h:i a';
$LOCAL_HOUR = 0;

// SHA1 hash of password. If empty (or commented out), no password is required
$PASSWORD = sha1("pensive");

$TEMPLATE = 'templates/wikiss.html'; // presentation template

// if true, you need to fill password for reading pages too
// before setting to true, read http://lionwiki.0o.cz/index.php?page=UserGuide%3A+How+to+use+PROTECTED_READ
$PROTECTED_READ = false;

$NO_HTML = true; // XSS protection

