import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:nova_messenger/main.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('shows registration and sign-in screen on first launch', (tester) async {
    SharedPreferences.setMockInitialValues({});
    final prefs = await SharedPreferences.getInstance();
    await tester.pumpWidget(NovaApp(prefs: prefs));
    await tester.pumpAndSettle();
    expect(find.text('NOVA'), findsOneWidget);
    expect(find.text('Войти'), findsOneWidget);
    expect(find.text('Нет аккаунта? Зарегистрироваться'), findsOneWidget);
  });
}
