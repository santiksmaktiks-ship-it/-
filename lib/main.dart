import 'package:flutter/material.dart';

void main() => runApp(const NovaApp());

const novaAccent = Color(0xFF8B7CFF);
const novaBg = Color(0xFF101116);
const novaPanel = Color(0xFF191B24);

class NovaApp extends StatelessWidget {
  const NovaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'NOVA',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: novaBg,
        colorScheme: ColorScheme.fromSeed(
          seedColor: novaAccent,
          brightness: Brightness.dark,
          surface: novaPanel,
        ),
        useMaterial3: true,
      ),
      home: const NovaHome(),
    );
  }
}

class NovaHome extends StatefulWidget {
  const NovaHome({super.key});

  @override
  State<NovaHome> createState() => _NovaHomeState();
}

class _NovaHomeState extends State<NovaHome> {
  int selected = 0;
  final messageController = TextEditingController();
  final messages = <String>[
    'Добро пожаловать в NOVA! Здесь начинается общение.',
    'Это стартовая сборка интерфейса. Следующий этап: подключение данных и аккаунтов.',
  ];

  final sections = const [
    ('#', 'general'),
    ('#', 'announcements'),
    ('◉', 'voice lounge'),
  ];

  @override
  void dispose() {
    messageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Row(
          children: [
            Container(
              width: 76,
              color: const Color(0xFF0B0C10),
              child: Column(
                children: [
                  const SizedBox(height: 14),
                  _server('N', true),
                  _server('🎮', false),
                  _server('♫', false),
                  const Spacer(),
                  _server('＋', false),
                  const SizedBox(height: 14),
                ],
              ),
            ),
            Container(
              width: 230,
              color: const Color(0xFF151720),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Padding(
                    padding: EdgeInsets.all(20),
                    child: Text('NOVA  ✦', style: TextStyle(fontSize: 21, fontWeight: FontWeight.w800, letterSpacing: 1.2)),
                  ),
                  const Padding(
                    padding: EdgeInsets.fromLTRB(16, 8, 16, 10),
                    child: Text('ТЕКСТОВЫЕ КАНАЛЫ', style: TextStyle(color: Colors.white54, fontSize: 11, fontWeight: FontWeight.bold)),
                  ),
                  for (var i = 0; i < sections.length; i++)
                    ListTile(
                      dense: true,
                      selected: selected == i,
                      selectedTileColor: novaAccent.withValues(alpha: .16),
                      leading: Text(sections[i].$1, style: const TextStyle(color: Colors.white54)),
                      title: Text(sections[i].$2),
                      onTap: () => setState(() => selected = i),
                    ),
                  const Spacer(),
                  Container(
                    padding: const EdgeInsets.all(14),
                    color: const Color(0xFF101116),
                    child: const Row(
                      children: [
                        CircleAvatar(backgroundColor: novaAccent, child: Icon(Icons.person, color: Colors.white)),
                        SizedBox(width: 10),
                        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          Text('Гость NOVA', style: TextStyle(fontWeight: FontWeight.w600)),
                          Text('Демо-профиль', style: TextStyle(color: Colors.white54, fontSize: 11)),
                        ])),
                        Icon(Icons.settings, color: Colors.white54, size: 19),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: Column(
                children: [
                  Container(
                    height: 64,
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: Colors.white10))),
                    child: Row(
                      children: [
                        const Icon(Icons.tag, color: Colors.white54),
                        const SizedBox(width: 10),
                        Text(sections[selected].$2, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                        const Spacer(),
                        const Icon(Icons.notifications_none, color: Colors.white54),
                        const SizedBox(width: 18),
                        const Icon(Icons.people_outline, color: Colors.white54),
                      ],
                    ),
                  ),
                  Expanded(
                    child: ListView(
                      padding: const EdgeInsets.all(24),
                      children: [
                        const SizedBox(height: 24),
                        const Text('Добро пожаловать в NOVA', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800)),
                        const SizedBox(height: 8),
                        const Text('Твоё пространство для общения, команд и идей.', style: TextStyle(color: Colors.white60)),
                        const SizedBox(height: 30),
                        for (final message in messages)
                          Padding(
                            padding: const EdgeInsets.only(bottom: 18),
                            child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                              const CircleAvatar(backgroundColor: novaAccent, child: Icon(Icons.person, color: Colors.white)),
                              const SizedBox(width: 12),
                              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                                const Text('NOVA Assistant  ·  сейчас', style: TextStyle(fontWeight: FontWeight.bold)),
                                const SizedBox(height: 4),
                                Text(message, style: const TextStyle(color: Colors.white70)),
                              ])),
                            ]),
                          ),
                      ],
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.fromLTRB(24, 8, 24, 22),
                    child: TextField(
                      controller: messageController,
                      onSubmitted: (_) => _send(),
                      decoration: InputDecoration(
                        hintText: 'Написать в #${sections[selected].$2}',
                        filled: true,
                        fillColor: novaPanel,
                        prefixIcon: const Icon(Icons.add_circle_outline),
                        suffixIcon: IconButton(icon: const Icon(Icons.send, color: novaAccent), onPressed: _send),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _server(String label, bool active) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 6),
        child: CircleAvatar(
          radius: 23,
          backgroundColor: active ? novaAccent : const Color(0xFF242733),
          child: Text(label, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
        ),
      );

  void _send() {
    final value = messageController.text.trim();
    if (value.isEmpty) return;
    setState(() {
      messages.add(value);
      messageController.clear();
    });
  }
}
