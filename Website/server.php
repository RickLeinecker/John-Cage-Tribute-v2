<?php

// Parameters to connect to a database
$dbHostname = "localhost";
$dbUser = "root";
$dbPassword = "MySQL!1996";
$dbName = "jctdatabase";
$id = '';

// Connection to database
$db = mysqli_connect($dbHostname, $dbUser, $dbPassword, $dbName);

if (!$db) die("Database connection failed!");

?>