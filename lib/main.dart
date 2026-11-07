import 'dart:convert';
import 'dart:math';
import 'package:crypto/crypto.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(NovaApp(prefs: await SharedPreferences.getInstance()));
}
const accent = Color(0xFF6657E8);
const muted = Color(0xFF777B8C);
String makeId() => DateTime.now().microsecondsSinceEpoch.toString() + Random.secure().nextInt(99999).toString();
String passwordHash(String salt, String password) => sha256.convert(utf8.encode('$salt:$password')).toString();

class NovaApp extends StatefulWidget {
  const NovaApp({super.key, required this.prefs});
  final SharedPreferences prefs;
  @override State<NovaApp> createState() => _NovaAppState();
}
class _NovaAppState extends State<NovaApp> {
  late bool dark = widget.prefs.getBool('dark') ?? false;
  void changeTheme(bool v) { setState(() => dark = v); widget.prefs.setBool('dark', v); }
  @override Widget build(BuildContext context) => MaterialApp(
    title: 'NOVA', debugShowCheckedModeBanner: false, themeMode: dark ? ThemeMode.dark : ThemeMode.light,
    theme: ThemeData(useMaterial3: true, brightness: Brightness.light, scaffoldBackgroundColor: Colors.white,
      colorScheme: ColorScheme.fromSeed(seedColor: accent, brightness: Brightness.light, surface: Colors.white),
      appBarTheme: const AppBarTheme(backgroundColor: Colors.white, foregroundColor: Color(0xFF202238), elevation: 0),
      inputDecorationTheme: InputDecorationTheme(filled: true, fillColor: const Color(0xFFF5F6FA),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: accent)))),
    darkTheme: ThemeData(useMaterial3: true, brightness: Brightness.dark, colorScheme: ColorScheme.fromSeed(seedColor: accent, brightness: Brightness.dark)),
    home: AuthGate(prefs: widget.prefs, dark: dark, onTheme: changeTheme));
}

class AuthGate extends StatefulWidget {
  const AuthGate({super.key, required this.prefs, required this.dark, required this.onTheme});
  final SharedPreferences prefs; final bool dark; final ValueChanged<bool> onTheme;
  @override State<AuthGate> createState() => _AuthGateState();
}
class _AuthGateState extends State<AuthGate> {
  Map<String,dynamic>? user; List<Map<String,dynamic>> chats = []; bool ready = false;
  @override void initState() { super.initState(); restore(); }
  Future<void> restore() async {
    final raw = widget.prefs.getString('session');
    if (raw != null) {
      try {
        user = Map<String,dynamic>.from(jsonDecode(raw) as Map);
        final saved = widget.prefs.getString('chats_' + user!['id']);
        if (saved != null) chats = (jsonDecode(saved) as List).map((e) => Map<String,dynamic>.from(e as Map)).toList();
      } catch (_) { user = null; }
    }
    if (mounted) setState(() => ready = true);
  }
  Future<void> persistChats() async { if (user != null) await widget.prefs.setString('chats_' + user!['id'], jsonEncode(chats)); }
  Future<void> enter(Map<String,dynamic> a) async {
    user = {'id':a['id'],'name':a['name'],'email':a['email']};
    final saved = widget.prefs.getString('chats_' + a['id']);
    chats = saved == null ? [] : (jsonDecode(saved) as List).map((e) => Map<String,dynamic>.from(e as Map)).toList();
    await widget.prefs.setString('session', jsonEncode(user));
    if (mounted) setState(() {});
  }
  Future<String?> register(String name, String email, String pass) async {
    final raw = widget.prefs.getString('accounts');
    final list = raw == null ? <Map<String,dynamic>>[] : (jsonDecode(raw) as List).map((e) => Map<String,dynamic>.from(e as Map)).toList();
    if (list.any((a) => (a['email'] as String).toLowerCase() == email.toLowerCase())) return 'Эта почта уже зарегистрирована';
    final salt = makeId();
    final account = <String,dynamic>{'id':makeId(),'name':name.trim(),'email':email.trim().toLowerCase(),'salt':salt,'hash':passwordHash(salt,pass)};
    list.add(account); await widget.prefs.setString('accounts',jsonEncode(list)); await enter(account); return null;
  }
  Future<String?> login(String email, String pass) async {
    final raw = widget.prefs.getString('accounts');
    final list = raw == null ? <dynamic>[] : jsonDecode(raw) as List;
    for (final item in list) {
      final a = Map<String,dynamic>.from(item as Map);
      if (a['email'] == email.trim().toLowerCase()) {
        if (a['hash'] == passwordHash(a['salt'] as String,pass)) { await enter(a); return null; }
        return 'Неверный пароль';
      }
    }
    return 'Аккаунт не найден';
  }
  Future<void> logout() async { await widget.prefs.remove('session'); if (mounted) setState(() { user=null; chats=[]; }); }
  void updateName(String name) {
    if (user == null || name.trim().length < 2) return;
    setState(() => user = {...user!, 'name':name.trim()});
    widget.prefs.setString('session',jsonEncode(user));
    final raw = widget.prefs.getString('accounts');
    if (raw != null) {
      final list = (jsonDecode(raw) as List).map((e) => Map<String,dynamic>.from(e as Map)).toList();
      final i = list.indexWhere((a) => a['id'] == user!['id']);
      if (i >= 0) { list[i]['name']=name.trim(); widget.prefs.setString('accounts',jsonEncode(list)); }
    }
  }
  @override Widget build(BuildContext context) {
    if (!ready) return const Scaffold(body: Center(child:CircularProgressIndicator()));
    if (user == null) return AuthScreen(onLogin:login,onRegister:register);
    return Messenger(user:user!,chats:chats,onChats:(v){chats=v;persistChats();},onLogout:logout,onName:updateName,dark:widget.dark,onTheme:widget.onTheme);
  }
}

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key,required this.onLogin,required this.onRegister});
  final Future<String?> Function(String,String) onLogin;
  final Future<String?> Function(String,String,String) onRegister;
  @override State<AuthScreen> createState()=>_AuthScreenState();
}
class _AuthScreenState extends State<AuthScreen> {
  final form=GlobalKey<FormState>(); final name=TextEditingController(),email=TextEditingController(),pass=TextEditingController();
  bool registerMode=false,busy=false,hide=true; String? error;
  @override void dispose(){name.dispose();email.dispose();pass.dispose();super.dispose();}
  Future<void> submit() async {
    if (!form.currentState!.validate()) return;
    setState(() { busy = true; error = null; });
    final result=registerMode?await widget.onRegister(name.text,email.text,pass.text):await widget.onLogin(email.text,pass.text);
    if(mounted)setState(() { busy = false; error = result; });
  }
  @override Widget build(BuildContext context) {
    final colors=Theme.of(context).colorScheme;
    return Scaffold(body:Center(child:SingleChildScrollView(padding:const EdgeInsets.all(24),child:ConstrainedBox(constraints:const BoxConstraints(maxWidth:420),child:Form(key:form,child:Column(crossAxisAlignment:CrossAxisAlignment.stretch,children:[
      Container(width:72,height:72,alignment:Alignment.center,decoration:BoxDecoration(color:accent,borderRadius:BorderRadius.circular(22)),child:const Text('N',style:TextStyle(color:Colors.white,fontSize:38,fontWeight:FontWeight.w900))),
      const SizedBox(height:24),const Text('NOVA',style:TextStyle(fontSize:34,fontWeight:FontWeight.w900,letterSpacing:2)),
      const SizedBox(height:8),Text(registerMode?'Создай аккаунт и начни общаться.':'Твои разговоры. В одном месте.',style:TextStyle(color:colors.onSurfaceVariant)),
      const SizedBox(height:28),
      if(registerMode)...[TextFormField(controller:name,decoration:const InputDecoration(labelText:'Имя',prefixIcon:Icon(Icons.person_outline)),validator:(v)=>v==null||v.trim().length<2?'Введи имя (минимум 2 символа)':null),const SizedBox(height:14)],
      TextFormField(controller:email,keyboardType:TextInputType.emailAddress,decoration:const InputDecoration(labelText:'Электронная почта',prefixIcon:Icon(Icons.mail_outline)),validator:(v)=>v==null||!RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$').hasMatch(v.trim())?'Проверь адрес почты':null),
      const SizedBox(height:14),TextFormField(controller:pass,obscureText:hide,decoration:InputDecoration(labelText:'Пароль',prefixIcon:const Icon(Icons.lock_outline),suffixIcon:IconButton(onPressed:()=>setState(()=>hide=!hide),icon:Icon(hide?Icons.visibility_outlined:Icons.visibility_off_outlined))),validator:(v)=>v==null||v.length<6?'Минимум 6 символов':null,onFieldSubmitted:(_)=>submit()),
      if(error!=null)...[const SizedBox(height:12),Text(error!,style:TextStyle(color:colors.error))],
      const SizedBox(height:22),FilledButton(onPressed:busy?null:submit,style:FilledButton.styleFrom(backgroundColor:accent,minimumSize:const Size.fromHeight(52)),child:busy?const SizedBox(width:20,height:20,child:CircularProgressIndicator(strokeWidth:2,color:Colors.white)):Text(registerMode?'Создать аккаунт':'Войти')),
      TextButton(onPressed:busy?null:()=>setState(() { registerMode = !registerMode; error = null; }),child:Text(registerMode?'Уже есть аккаунт? Войти':'Нет аккаунта? Зарегистрироваться')),
      const SizedBox(height:16),Text('Локальная версия: профиль и переписки сохраняются на этом устройстве.',textAlign:TextAlign.center,style:TextStyle(color:colors.onSurfaceVariant,fontSize:12)),
    ]))))));
  }
}

class Messenger extends StatefulWidget {
  const Messenger({super.key,required this.user,required this.chats,required this.onChats,required this.onLogout,required this.onName,required this.dark,required this.onTheme});
  final Map<String,dynamic> user; final List<Map<String,dynamic>> chats;
  final ValueChanged<List<Map<String,dynamic>>> onChats; final VoidCallback onLogout; final ValueChanged<String> onName; final bool dark; final ValueChanged<bool> onTheme;
  @override State<Messenger> createState()=>_MessengerState();
}
class _MessengerState extends State<Messenger>{
  String? selectedId; final input=TextEditingController(); final scroll=ScrollController();
  @override void dispose(){input.dispose();scroll.dispose();super.dispose();}
  Map<String,dynamic>? get current { for(final c in widget.chats){if(c['id']==selectedId)return c;}return null; }
  void save()=>widget.onChats(widget.chats);
  Future<void> newChat() async {
    final ctl=TextEditingController();
    final title=await showDialog<String>(context:context,builder:(ctx)=>AlertDialog(title:const Text('Новый диалог'),content:TextField(controller:ctl,autofocus:true,decoration:const InputDecoration(labelText:'Имя собеседника или название'),onSubmitted:(_)=>Navigator.pop(ctx,ctl.text.trim())),actions:[TextButton(onPressed:()=>Navigator.pop(ctx),child:const Text('Отмена')),FilledButton(onPressed:()=>Navigator.pop(ctx,ctl.text.trim()),child:const Text('Создать'))]));
    ctl.dispose(); if(title==null||title.trim().isEmpty)return;
    final existing=widget.chats.where((c)=>(c['title'] as String).toLowerCase()==title.trim().toLowerCase()).firstOrNull;
    if(existing!=null){setState(()=>selectedId=existing['id'] as String);return;}
    final c=<String,dynamic>{'id':makeId(),'title':title.trim(),'messages':<dynamic>[],'createdAt':DateTime.now().toIso8601String()};
    setState(() { widget.chats.insert(0,c); selectedId = c['id'] as String; });save();
  }
  void send(){
    final text=input.text.trim(),c=current;if(text.isEmpty||c==null)return;
    setState((){
      (c['messages'] as List).add({'id':makeId(),'text':text,'mine':true,'time':DateTime.now().toIso8601String()});
      c['lastMessage']=text;c['updatedAt']=DateTime.now().toIso8601String();
      widget.chats.sort((a,b)=>(b['updatedAt']??b['createdAt']).toString().compareTo((a['updatedAt']??a['createdAt']).toString()));
      selectedId=c['id'] as String;input.clear();
    });save();
    WidgetsBinding.instance.addPostFrameCallback((_){if(scroll.hasClients)scroll.animateTo(scroll.position.maxScrollExtent,duration:const Duration(milliseconds:200),curve:Curves.easeOut);});
  }
  Future<void> profile() async {
    final ctl=TextEditingController(text:widget.user['name'] as String);
    final value=await showDialog<String>(context:context,builder:(ctx)=>AlertDialog(title:const Text('Имя профиля'),content:TextField(controller:ctl,autofocus:true,decoration:const InputDecoration(labelText:'Имя')),actions:[TextButton(onPressed:()=>Navigator.pop(ctx),child:const Text('Отмена')),FilledButton(onPressed:()=>Navigator.pop(ctx,ctl.text.trim()),child:const Text('Сохранить'))]));
    ctl.dispose();if(value!=null&&value.trim().length>=2)widget.onName(value);
  }
  Future<void> settings() async {
    await showModalBottomSheet<void>(context:context,showDragHandle:true,builder:(ctx)=>StatefulBuilder(builder:(ctx,refresh)=>SafeArea(child:Padding(padding:const EdgeInsets.fromLTRB(20,8,20,24),child:Column(mainAxisSize:MainAxisSize.min,children:[
      const Align(alignment:Alignment.centerLeft,child:Text('Настройки',style:TextStyle(fontSize:22,fontWeight:FontWeight.w800))),
      SwitchListTile(contentPadding:EdgeInsets.zero,title:const Text('Тёмная тема'),subtitle:const Text('Светлая тема включена по умолчанию'),secondary:const Icon(Icons.dark_mode_outlined),value:widget.dark,onChanged:(v){widget.onTheme(v);refresh((){});}),
      ListTile(contentPadding:EdgeInsets.zero,leading:const Icon(Icons.person_outline),title:const Text('Изменить имя профиля'),onTap:(){Navigator.pop(ctx);profile();}),
      ListTile(contentPadding:EdgeInsets.zero,leading:const Icon(Icons.logout),title:const Text('Выйти из аккаунта'),onTap:(){Navigator.pop(ctx);widget.onLogout();}),
      const Align(alignment:Alignment.centerLeft,child:Text('NOVA 0.2 · локальный прототип',style:TextStyle(color:muted,fontSize:12))),
    ])))));
  }
  @override Widget build(BuildContext context){
    final theme=Theme.of(context),narrow=MediaQuery.sizeOf(context).width<720,c=current;
    return Scaffold(appBar:AppBar(automaticallyImplyLeading:false,title:Row(children:[Container(width:34,height:34,alignment:Alignment.center,decoration:BoxDecoration(color:accent,borderRadius:BorderRadius.circular(10)),child:const Text('N',style:TextStyle(color:Colors.white,fontWeight:FontWeight.w900,fontSize:20))),const SizedBox(width:10),const Text('NOVA',style:TextStyle(fontWeight:FontWeight.w900,letterSpacing:1.4))]),actions:[IconButton(tooltip:'Настройки',onPressed:settings,icon:const Icon(Icons.settings_outlined))]),
      body:narrow?(c==null?chatList(theme):chatView(theme,c,true)):Row(children:[SizedBox(width:320,child:chatList(theme)),VerticalDivider(width:1,color:theme.dividerColor),Expanded(child:c==null?welcome(theme):chatView(theme,c,false))]));
  }
  Widget chatList(ThemeData theme)=>Column(children:[
    Padding(padding:const EdgeInsets.fromLTRB(18,20,14,14),child:Row(children:[const Expanded(child:Text('Сообщения',style:TextStyle(fontSize:22,fontWeight:FontWeight.w800))),IconButton.filledTonal(tooltip:'Создать чат',onPressed:newChat,icon:const Icon(Icons.edit_square,color:accent))])),
    Expanded(child:widget.chats.isEmpty?Center(child:Padding(padding:const EdgeInsets.all(24),child:Column(mainAxisSize:MainAxisSize.min,children:[Icon(Icons.forum_outlined,size:48,color:theme.colorScheme.onSurfaceVariant.withValues(alpha:.45)),const SizedBox(height:14),const Text('Пока нет чатов',style:TextStyle(fontWeight:FontWeight.w700,fontSize:16)),const SizedBox(height:6),Text('Создай первый диалог кнопкой сверху.',textAlign:TextAlign.center,style:TextStyle(color:theme.colorScheme.onSurfaceVariant)),const SizedBox(height:16),FilledButton.icon(onPressed:newChat,icon:const Icon(Icons.add),label:const Text('Новый чат'))])))
      :ListView.builder(itemCount:widget.chats.length,itemBuilder:(ctx,i){
        final c=widget.chats[i],title=c['title'] as String;
        return ListTile(selected:c['id']==selectedId,selectedTileColor:accent.withValues(alpha:.09),contentPadding:const EdgeInsets.symmetric(horizontal:16,vertical:4),
          leading:CircleAvatar(backgroundColor:accent.withValues(alpha:.13),foregroundColor:accent,child:Text(title.substring(0,1).toUpperCase())),
          title:Text(title,maxLines:1,overflow:TextOverflow.ellipsis,style:const TextStyle(fontWeight:FontWeight.w700)),
          subtitle:Text(c['lastMessage'] as String? ?? 'Начни разговор',maxLines:1,overflow:TextOverflow.ellipsis,style:TextStyle(color:theme.colorScheme.onSurfaceVariant,fontSize:12)),
          onTap:()=>setState(()=>selectedId=c['id'] as String),
          trailing:PopupMenuButton<String>(tooltip:'Действия',onSelected:(v){if(v=='delete'){setState(() { widget.chats.removeWhere((x)=>x['id']==c['id']); if(selectedId==c['id']) selectedId=null; });save();}},itemBuilder:(_)=>const[PopupMenuItem(value:'delete',child:Text('Удалить чат'))]));
      })),
    Container(padding:const EdgeInsets.fromLTRB(14,12,14,14),decoration:BoxDecoration(border:Border(top:BorderSide(color:theme.dividerColor))),child:Row(children:[
      CircleAvatar(backgroundColor:accent.withValues(alpha:.14),foregroundColor:accent,child:Text((widget.user['name'] as String).substring(0,1).toUpperCase())),
      const SizedBox(width:10),Expanded(child:Column(crossAxisAlignment:CrossAxisAlignment.start,children:[Text(widget.user['name'] as String,maxLines:1,overflow:TextOverflow.ellipsis,style:const TextStyle(fontWeight:FontWeight.w700)),Text(widget.user['email'] as String,maxLines:1,overflow:TextOverflow.ellipsis,style:TextStyle(fontSize:11,color:theme.colorScheme.onSurfaceVariant))])),
      IconButton(tooltip:'Профиль и настройки',onPressed:settings,icon:const Icon(Icons.more_horiz)),
    ]))
  ]);
  Widget welcome(ThemeData theme)=>Center(child:Column(mainAxisSize:MainAxisSize.min,children:[
    Container(width:86,height:86,alignment:Alignment.center,decoration:BoxDecoration(color:accent.withValues(alpha:.1),borderRadius:BorderRadius.circular(28)),child:const Icon(Icons.forum_outlined,size:42,color:accent)),
    const SizedBox(height:18),const Text('Твои разговоры начинаются здесь',style:TextStyle(fontSize:21,fontWeight:FontWeight.w800)),
    const SizedBox(height:8),Text('Выбери чат слева или создай новый диалог.',style:TextStyle(color:theme.colorScheme.onSurfaceVariant)),
    const SizedBox(height:18),FilledButton.icon(onPressed:newChat,icon:const Icon(Icons.add),label:const Text('Создать чат'))
  ]));
  Widget chatView(ThemeData theme,Map<String,dynamic> c,bool narrow){
    final msgs=(c['messages'] as List).cast<Map>();
    return Column(children:[
      Container(height:68,padding:const EdgeInsets.symmetric(horizontal:18),decoration:BoxDecoration(border:Border(bottom:BorderSide(color:theme.dividerColor))),child:Row(children:[
        if(narrow)IconButton(onPressed:()=>setState(()=>selectedId=null),icon:const Icon(Icons.arrow_back)),
        CircleAvatar(backgroundColor:accent.withValues(alpha:.13),foregroundColor:accent,child:Text((c['title'] as String).substring(0,1).toUpperCase())),
        const SizedBox(width:12),Expanded(child:Column(mainAxisAlignment:MainAxisAlignment.center,crossAxisAlignment:CrossAxisAlignment.start,children:[Text(c['title'] as String,style:const TextStyle(fontWeight:FontWeight.w800,fontSize:16)),Text('Локальный диалог',style:TextStyle(color:theme.colorScheme.onSurfaceVariant,fontSize:11))])),
        IconButton(tooltip:'Информация',onPressed:()=>showDialog<void>(context:context,builder:(ctx)=>AlertDialog(title:Text(c['title'] as String),content:const Text('Это локальный диалог на этом устройстве. Чтобы переписываться с другими людьми, нужно подключить сервер NOVA.'),actions:[TextButton(onPressed:()=>Navigator.pop(ctx),child:const Text('Понятно'))])),icon:const Icon(Icons.info_outline))
      ])),
      Expanded(child:msgs.isEmpty?Center(child:Column(mainAxisSize:MainAxisSize.min,children:[const Icon(Icons.waving_hand_outlined,size:42,color:accent),const SizedBox(height:12),Text('Начни разговор с ' + (c['title'] as String),style:const TextStyle(fontWeight:FontWeight.w700,fontSize:16)),const SizedBox(height:6),Text('Напиши первое сообщение ниже.',style:TextStyle(color:theme.colorScheme.onSurfaceVariant))]))
      :ListView.builder(controller:scroll,padding:const EdgeInsets.all(20),itemCount:msgs.length,itemBuilder:(ctx,i){
        final m=msgs[i],mine=m['mine']==true;
        final time=DateTime.tryParse(m['time'] as String)?.toLocal();
        final stamp=time==null?'':time.hour.toString().padLeft(2,'0')+':'+time.minute.toString().padLeft(2,'0');
        return Align(alignment:mine?Alignment.centerRight:Alignment.centerLeft,child:Container(constraints:BoxConstraints(maxWidth:MediaQuery.sizeOf(context).width*.68),margin:const EdgeInsets.only(bottom:12),padding:const EdgeInsets.symmetric(horizontal:15,vertical:11),
          decoration:BoxDecoration(color:mine?accent:theme.colorScheme.surfaceContainerHighest,borderRadius:BorderRadius.only(topLeft:const Radius.circular(17),topRight:const Radius.circular(17),bottomLeft:Radius.circular(mine?17:5),bottomRight:Radius.circular(mine?5:17))),
          child:Column(crossAxisAlignment:CrossAxisAlignment.end,children:[Text(m['text'] as String,style:TextStyle(color:mine?Colors.white:theme.colorScheme.onSurface,fontSize:14)),const SizedBox(height:4),Text(stamp,style:TextStyle(color:mine?Colors.white70:theme.colorScheme.onSurfaceVariant,fontSize:10))])));
      })),
      Padding(padding:const EdgeInsets.fromLTRB(16,8,16,16),child:Row(children:[
        Expanded(child:TextField(controller:input,minLines:1,maxLines:5,textCapitalization:TextCapitalization.sentences,decoration:InputDecoration(hintText:'Сообщение...',fillColor:theme.colorScheme.surfaceContainerHighest,suffixIcon:IconButton(tooltip:'Очистить ввод',onPressed:()=>input.clear(),icon:const Icon(Icons.close,size:18))),onSubmitted:(_)=>send())),
        const SizedBox(width:9),SizedBox(height:50,width:50,child:FilledButton(onPressed:send,style:FilledButton.styleFrom(backgroundColor:accent,padding:EdgeInsets.zero,shape:RoundedRectangleBorder(borderRadius:BorderRadius.circular(15))),child:const Icon(Icons.send_rounded,color:Colors.white)))
      ]))
    ]);
  }
}
