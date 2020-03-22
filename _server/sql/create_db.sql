DROP DATABASE IF EXISTS Pianoboard;
CREATE DATABASE Pianoboard;
USE Pianoboard;

/* ACCOUNT SPECIFIC ENTITIES */
CREATE TABLE Account (
	AccountID INT UNSIGNED AUTO_INCREMENT,
	Email VARCHAR(64) NOT NULL,
	Username VARCHAR(32) NOT NULL,
	Password CHAR(64) NOT NULL,
	Creation_date BIGINT UNSIGNED,
	Is_private BIT,
	CONSTRAINT Account_PK PRIMARY KEY (AccountID)
);

CREATE TABLE Known_IP (
	AccountID INT UNSIGNED NOT NULL,
	IP_address INT UNSIGNED,
	Login_count INT UNSIGNED,
	Last_login BIGINT UNSIGNED,
	FOREIGN KEY (AccountID) REFERENCES Account(AccountID)
);

CREATE TABLE Failed_IP (
	AccountID INT UNSIGNED NOT NULL,
	IP_address INT UNSIGNED UNSIGNED,
	Attempt_count INT UNSIGNED,
	Last_attempt BIGINT UNSIGNED,
	FOREIGN KEY (AccountID) REFERENCES Account(AccountID)
);

CREATE TABLE Favorite_genres (
	AccountID INT UNSIGNED NOT NULL,
	Genre VARCHAR(32) NOT NULL,
	CONSTRAINT Genre_FK FOREIGN KEY (AccountID) REFERENCES Account(AccountID)
);

CREATE TABLE Favorite_artists (
	AccountID INT UNSIGNED NOT NULL,
	Artist VARCHAR(32) NOT NULL,
	CONSTRAINT Artist_FK FOREIGN KEY (AccountID) REFERENCES Account(AccountID)
);

/* AUTHENTICATION ENTITIES */
CREATE TABLE Access_token (
	Token CHAR(64) NOT NULL,
	AccountID INT UNSIGNED NOT NULL,
	Expiration_date BIGINT UNSIGNED NOT NULL,
	CONSTRAINT Token_PK PRIMARY KEY (Token),
	CONSTRAINT Token_FK FOREIGN KEY (AccountID) REFERENCES Account(AccountID)
);

CREATE TABLE Access_rights (
	EntityID INT UNSIGNED NOT NULL,
	AccountID INT UNSIGNED NOT NULL,
	Rights CHAR(3)
	CONSTRAINT Rights_PK PRIMARY KEY (EntityID)
	CONSTRAINT Rights_FK FOREIGN KEY (AccountID) REFERENCES Account(AccountID)
);

/* PROJECT ENTITIES */
CREATE TABLE Project (
	ProjectID INT UNSIGNED NOT NULL AUTO_INCREMENT,
	AccountID INT UNSIGNED NOT NULL,
	Name VARCHAR(32) NOT NULL,
	Genre VARCHAR(32),
	Time_signature CHAR(5) NOT NULL,
	Tempo TINYINT UNSIGNED NOT NULL,
	Creation_date BIGINT UNSIGNED NOT NULL,
	Last_modified BIGINT UNSIGNED,
	Is_private BIT,
	CONSTRAINT Project_PK PRIMARY KEY (ProjectID),
	CONSTRAINT Project_FK FOREIGN KEY (AccountID) REFERENCES Account(AccountID)
);

CREATE TABLE Track (
	TrackID INT UNSIGNED NOT NULL AUTO_INCREMENT,
	ProjectID INT UNSIGNED NOT NULL,
	Name VARCHAR(32) NOT NULL,
	Instrument VARCHAR(32) NOT NULL,
	Volume TINYINT NOT NULL,
	Pan TINYINT NOT NULL,
	Mute BIT,
	Solo BIT,
	Creation_date BIGINT UNSIGNED NOT NULL,
	Last_modified BIGINT UNSIGNED,
	CONSTRAINT Track_PK PRIMARY KEY (TrackID),
	CONSTRAINT Track_FK FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID)
);

CREATE TABLE Recording (
	RecordingID INT UNSIGNED NOT NULL AUTO_INCREMENT,
	TrackID INT UNSIGNED NOT NULL,
	Start_time 
)