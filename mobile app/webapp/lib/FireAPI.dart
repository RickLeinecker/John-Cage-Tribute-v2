import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';

class AuthenticationService {
  AuthenticationService(this._firebase);
  final FirebaseAuth _firebase;

  Stream<User?> get authStateChanges => _firebase.authStateChanges();

  Future<void> signOut() async {
    await _firebase.signOut();
  }

  Future<String> signIn({String email = '', String password = ''}) async {
    try {
      await _firebase.signInWithEmailAndPassword(
          email: email, password: password);
      return "Signed in";
    } on FirebaseAuthException catch (e) {
      return e.message.toString();
    }
  }

  Future<String> signUp({String email = '', String password = ''}) async {
    try {
      await _firebase.createUserWithEmailAndPassword(
          email: email, password: password);
      return "Signed up";
    } on FirebaseAuthException catch (e) {
      return e.message.toString();
    }
  }
}
