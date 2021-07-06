<?php

 class TestingSession extends Model {


  static function JSONMap() {
   return array(
    "assessmentQuestion" => array( "r_AssessmentQuestion", 'reference' ),
    "startingToken" => array( "StartingSessionToken", 'string' ),
    "tokens" => array( "SessionTokens", 'string' ),
    "remaining" => array( "TimeLimit", 'integer' ),
    "paused" => array( "Paused", 'bool' ),
    "questionStarted" => array( "QuestionStarted", 'bool' ),
    "remaining" => array( "Remaining", 'text' ),
    "completed" => array( "Completed", 'text' ),
    "nextQuestionStarts" => array( "NextQuestionStarts", 'integer' ),
	"timePassed" => array( "TimePassed", 'integer' ),
	"timeStarted" => array( "TimeStarted", 'integer' )
   );
  }

   // Checks and updates session token tracker
   static function TrackSessionTokensAndIP() {}

   // Completes a test and scores it, queues it for hand-grading if required,
   // then adds an anti-cheat confidence value
   static function CompleteTest() {}

   // Returns a list of paused sessions.  Sessions start paused prior to question 1.
   static function Paused() {
    global $database,$auth;
    $m = new TestingSession($database);
   }

   // Returns data on the current question (content, etc)
   static function Current() {
    global $database,$auth;
    $m = new TestingSession($database);
   }

   // Returns number of remaining questions, remaining time on current question, completed questions,
   // when the next question starts, the current question if there is one
   static function Status( $vars ) {
    global $database,$auth;
    $m = new TestingSession($database);
   }

   // Pauses the testing session to be resumed later, can only be done between questions
   static function Pause() {
    global $database,$auth;
    $m = new TestingSession($database);
   }

   // Resumes a previously paused session
   static function Resume( $vars ) {
    global $database,$auth;
    $m = new TestingSession($database);
   }

   // Attempts to skip the current question
   static function Skip() {
    global $database,$auth;
    $m = new TestingSession($database);
   }

   // Indicates the tester is ready to go (start the test after introductory content)
   static function Begin() {
    global $database,$auth;
    $m = new TestingSession($database);
   }

   // User has asserted an answer, record it and cycle the test forward.
   static function Answer( $vars ) {
    global $database,$auth;
    $m = new TestingSession($database);
   }

 };
