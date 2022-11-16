// Packages
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutterapp/main.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:socket_io_client/socket_io_client.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'HomePage.dart';
import 'CustomPackages/popups.dart';

// These two variables hold the username and password, respectively
final _emailController = TextEditingController();
final _passController = TextEditingController();

@override
void dispose() {
  // Clean up the controllers when the widget is removed from widget tree
  _emailController.dispose();
  _passController.dispose();
}

class LoginPage extends ConsumerWidget {
  const LoginPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    Socket socket = ref.watch(socketProvider);
    FlutterSecureStorage storage = ref.read(storageProvider);

    return MaterialApp(
        title: "John Cage Tribute",
        home: Scaffold(
          backgroundColor: const Color.fromARGB(255, 214, 214, 214),
          appBar: AppBar(
            title: const Text('Admin Login'),
          ),
          body: Center(
              child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                const SizedBox(height: 35),

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
                        'Welcome back! Please login:',
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
                // End Login: Username

                const SizedBox(height: 10),

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
                                  signin(socket, context, ref);
                                },
                                child: const Text('Sign in',
                                    style: TextStyle(
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold)))))),

                const SizedBox(height: 30),

                // TODO: Print if there's an error in the login
              ])),
        ));
  }

  void signin(Socket socket, BuildContext context, WidgetRef ref) {
    FlutterSecureStorage myStorage = new FlutterSecureStorage();
    final _email = _emailController.text.trim();
    final _password = _passController.text.trim();

    // Credentials JSON to send to the server
    final _credentials = {"email": _email, "password": _password};

    print(_credentials);

    socket.emit("login", _credentials);

    socket.on("loginsuccess", (data) async {
      await myStorage.write(key: "jctacc", value: data['accessToken']);

      var token = myStorage.read(key: "jctacc");

      var decoded = JwtDecoder.decode(data['accessToken']);
      print(decoded['username']);
      print(decoded['userId']);

      // Set username & ID here
      ref.read(userProvider.notifier).state = decoded['username'];
      ref.read(idProvider.notifier).state = decoded['userId'];
      ref.read(loggedProvider.notifier).state = true;

      print("User: ${ref.read(userProvider.notifier).state}");
      print("Id: ${ref.read(idProvider.notifier).state}");

      _emailController.text = '';
      _passController.text = '';

      Navigator.of(context).pop();

      Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (context) => HomePage(),
          ));
    });

    socket.on("loginerror", (err) {
      displayErr(context, err['msg']);
    });
  }
}
