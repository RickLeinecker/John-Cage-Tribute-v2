// Packages
import 'package:flutter/material.dart';
import 'package:flutterapp/main.dart';
import 'package:socket_io_client/socket_io_client.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

// These two variables hold the username and password, respectively
final _userController = TextEditingController();
final _emailController = TextEditingController();
final _passController = TextEditingController();
final _passConfController = TextEditingController();

@override
void dispose() {
  // Clean up the controllers when the widget is removed from widget tree
  print("Disposal!");

  _userController.dispose();
  _emailController.dispose();
  _passController.dispose();
  _passConfController.dispose();
}

class SignUp extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    Socket socket = ref.watch(socketProvider);

    // This method is rerun every time setState is called, for instance as done
    // by the _incrementCounter method above.
    return MaterialApp(
        title: "John Cage Tribute",
        home: Scaffold(
          backgroundColor: const Color.fromARGB(255, 214, 214, 214),
          appBar: AppBar(
            title: const Text('JCT - SignUp'),
          ),
          body: Center(
              child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                Container(
                  height: 75,
                  decoration: BoxDecoration(
                      color: Colors.white,
                      border: Border.all(color: Colors.black),
                      borderRadius: BorderRadius.circular(5),
                      boxShadow: const [
                        BoxShadow(
                          color: Colors.grey,
                          blurRadius: 10,
                          spreadRadius: 3,
                          offset: Offset(3, 3),
                        ),
                      ]),
                  child: const FractionallySizedBox(
                    heightFactor: 0.5,
                    widthFactor: 0.67,
                    child: Padding(
                      padding: EdgeInsets.symmetric(horizontal: 5.0),
                      child: Text(
                        'Welcome!',
                        style: TextStyle(
                          fontWeight: FontWeight.w300,
                          fontSize: 20,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 50),

                // Registration forms

                // Login: Username
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 70.0),
                  child: Container(
                      height: 60,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        border: Border.all(color: Colors.black),
                        borderRadius: BorderRadius.circular(5),
                      ),
                      child: Padding(
                          padding: const EdgeInsets.only(left: 5.0, right: 5.0),
                          child: TextField(
                            textAlignVertical: TextAlignVertical.center,
                            controller: _userController,
                            decoration: const InputDecoration(
                              border: InputBorder.none,
                              hintText: 'Username',
                            ),
                          ))),
                ),
                // End Login: Email

                const SizedBox(height: 15),

                // Login: Email
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 70.0),
                  child: Container(
                      height: 60,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        border: Border.all(color: Colors.black),
                        borderRadius: BorderRadius.circular(5),
                      ),
                      child: Padding(
                          padding: const EdgeInsets.only(left: 5.0, right: 5.0),
                          child: TextField(
                            textAlignVertical: TextAlignVertical.center,
                            controller: _emailController,
                            decoration: const InputDecoration(
                              border: InputBorder.none,
                              hintText: 'Email',
                            ),
                          ))),
                ),
                // End Login: Email

                const SizedBox(height: 15),

                // Login: Password
                Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 70.0),
                    child: Container(
                        height: 60,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          border: Border.all(color: Colors.black),
                          borderRadius: BorderRadius.circular(5),
                        ),
                        child: Padding(
                            padding:
                                const EdgeInsets.only(left: 5.0, right: 5.0),
                            child: TextField(
                                controller: _passController,
                                decoration: const InputDecoration(
                                  border: InputBorder.none,
                                  hintText: 'Password',
                                ),
                                obscureText: true)))),
                // End Login: Password

                const SizedBox(height: 15),

                // Login: Password confirmation
                Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 70.0),
                    child: Container(
                        height: 60,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          border: Border.all(color: Colors.black),
                          borderRadius: BorderRadius.circular(5),
                        ),
                        child: Padding(
                            padding:
                                const EdgeInsets.only(left: 5.0, right: 5.0),
                            child: TextField(
                                controller: _passConfController,
                                decoration: const InputDecoration(
                                  border: InputBorder.none,
                                  hintText: 'Password',
                                ),
                                obscureText: true)))),
                // End Login: Password confirmation

                // End registration forms

                const SizedBox(height: 50),

                // Sign in button
                Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 100.0),
                    child: Container(
                        height: 60,
                        width: 200,
                        decoration: BoxDecoration(
                          color: Colors.lightBlue,
                          border: Border.all(color: Colors.black),
                          borderRadius: BorderRadius.circular(5),
                        ),
                        child: Padding(
                            padding: const EdgeInsets.only(left: 7.5),
                            child: TextButton(
                                onPressed: () {
                                  register(socket);
                                },
                                child: const Text('Register',
                                    style: TextStyle(
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold)))))),

                const SizedBox(height: 30),

                // TODO: Print if there's an error in the login
              ])),
        ));
  }

void register(Socket socket) {
  final _username = _userController.text.trim();
  final _email = _emailController.text.trim();
  final _password = _passController.text.trim();
  final _passwordConf = _passConfController.text.trim();

  // Credentials JSON to send to the server
  final _credentials = {
    "username": _username,
    "email": _email,
    "password": _password,
    "passwordconfirm": _passwordConf
  };

  print(_credentials);
  socket.emit("register", _credentials);

  socket.on("regsuccess", (data) {
    print(data);
  });

  socket.on("regerror", (error) {
    print(error);
  });
}
}

// Authentication wrapper, handles user authentication
// through Firebase's Authentication API
// class AuthenticationWrapper extends StatelessWidget {
//   const AuthenticationWrapper({Key? key}) : super(key: key);

//   @override
//   Widget build(BuildContext context) {
//     return const LoginPage(title: 'Sign In');
//   }
// }
