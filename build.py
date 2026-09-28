#!/usr/bin/env python3
"""Assembles index.html (single self-contained file) from src/."""
import pathlib
R = pathlib.Path(__file__).parent
src = lambda n: (R / 'src' / n).read_text(encoding='utf-8')

ALT = [
 'Okładka: czerwony samolocik Dusty w żółtym kasku leci nad zaśnieżonym lasem. Zza świerka wygląda Yeti, a dziewczynka w czapce z pomponem patrzy w górę.',
 'Rano w dolinie samolocik Dusty śpi pod kocykiem przed czerwoną chatą, z komina wznosi się dym, a nad nim unoszą się literki z.',
 'Dzwon strażacki dzwoni. Dusty ma szeroko otwarte oczy i patrzy w górę na dzwon.',
 'Dusty leci nad zaśnieżonym lasem i zamarzniętym jeziorem, a łoś na brzegu patrzy w niebo.',
 'Na zaśnieżonym zboczu płonie mały ogienek z buzią. Yeti i dziewczynka patrzą na niego z przerażeniem, a w oddali leci Dusty.',
 'Dusty leci tuż nad jeziorem i nabiera wodę do zbiornika. Woda pryska na boki.',
 'Dusty polewa ogień wodą z góry. Ogienek się kurczy, a wokół unosi się para. Yeti i dziewczynka patrzą.',
 'Zza chmur wyszło słońce. Yeti i dziewczynka cieszą się z uniesionymi rękami, a Dusty robi pętlę w powietrzu.',
 'Wieczorem Dusty śpi pod kocykiem obok chaty z ciepło świecącym oknem. Na niebie tańczy zorza polarna.'
]
TEXT = [
 None,
 '<p class="story">Rano, kiedy góry były jeszcze różowe od słońca, w małej dolinie spał samolot <b class="name">Dusty</b>.</p><p class="story"><span class="snd">Chrrr… chrrr…</span> Śniło mu się, że fruwa wyżej niż wszystkie orły.</p>',
 '<p class="story">Nagle: <span class="snd">DZYŃ! DZYŃ! DZYŃ!</span> To zadzwonił dzwon strażacki.</p><p class="story">— Ktoś potrzebuje pomocy! — zawołał Dusty. Naciągnął żółty kask i był gotowy do lotu.</p>',
 '<p class="story"><span class="snd">Wrrr! Wrrr!</span> Dusty wzbił się nad las i nad zamarznięte jezioro.</p><p class="story">Łoś, który akurat pił wodę, aż uniósł głowę. — Dokąd tak pędzisz? — Nie wiem jeszcze! — zawołał Dusty. — Ale ktoś mnie woła!</p>',
 '<p class="story">Na zboczu góry siedział wielki Yeti, a obok stała dziewczynka w czerwonej czapce. Przed nimi tańczył malutki ogienek. <span class="snd">Trzask! Trzask!</span></p><p class="story">— Ojej — szepnął Yeti. — Upiekliśmy ziemniaki i zapomnieliśmy zgasić ognisko!<br>— Spokojnie! — zawołał Dusty. — Lecę po wodę!</p>',
 '<p class="story">Dusty pomknął nad jezioro. Niżej… niżej… tak nisko, że aż zmoczył brzuch.</p><p class="story"><span class="snd">CHLUP!</span> I już miał pełny zbiornik wody.</p>',
 '<p class="story">Wrócił nad zbocze i pochylił nos. <span class="snd">Psssssst!</span> Woda spadła jak deszcz.</p><p class="story">Ogienek zasyczał: <i>sssss…</i> i zasnął, a nad nim uniósł się biały obłoczek pary.</p>',
 '<p class="story">Śnieg przestał sypać, a zza chmur wyjrzało słońce.</p><p class="story">— Hurra! — zawołał Yeti tak głośno, że z drzew posypał się śnieg. — Dziękujemy, Dusty!<br>A potem obiecał: — Od dziś ognisko zawsze zalewam wodą, zanim pójdę spać.</p>',
 '<p class="story">Wieczorem Dusty wrócił do hangaru. Był zmęczony i bardzo dumny. Na niebie zatańczyła zorza.</p><p class="story">— Dobranoc, Dusty. Dobranoc, dolino. <span class="snd">Zzzz…</span></p>'
]
TULIP = '<svg class="orn" viewBox="0 0 120 24" aria-hidden="true"><path d="M 0,12 H 46 M 74,12 H 120" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity=".5"/><path d="M 60,20 C 47,12 48,3 54,3 C 57,3 59,5 60,8 C 61,5 63,3 66,3 C 72,3 73,12 60,20 Z" fill="var(--accent)"/></svg>'

pages = []
for i, alt in enumerate(ALT):
    art = f'<figure class="art" role="img" aria-label="{alt}"><div class="wait">Malujemy…</div><canvas class="paint" width="4" height="3"></canvas><canvas class="fx"></canvas></figure>'
    if i == 0:
        txt = ('<div class="txt cover"><p class="kicker">Bajka o samolocie strażaku i Yeti</p><h1>Dusty i&nbsp;mały ogienek</h1>' + TULIP +
               '<button class="go" type="button" data-next>Zaczynamy →</button>'
               '<p class="hint">Przesuwaj strony palcem albo strzałkami.<br>Dotknij obrazka, a coś zaiskrzy.</p></div>')
    else:
        end = ''
        if i == len(ALT) - 1:
            end = '<p class="fin">Koniec</p><button class="go" type="button" data-first>Jeszcze raz ↺</button>'
        txt = f'<div class="txt">{TEXT[i]}{end if end else TULIP}</div>'
    pages.append(f'<section class="page" id="p{i}" aria-label="Strona {i+1} z {len(ALT)}"><div class="spread">{art}{txt}</div></section>')

html = f'''<title>Dusty i mały ogienek</title>
<meta name="description" content="Ilustrowana bajka dla przedszkolaków o samolocie strażaku i Yeti, malowana w przeglądarce.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Fraunces:opsz,wght,SOFT,WONK@9..144,500;9..144,800,100,1&display=swap" rel="stylesheet">
<style>{src('page.css')}</style>
<main class="book" id="book" aria-label="Bajka Dusty i mały ogienek">{''.join(pages)}</main>
<nav class="nav" aria-label="Przewracanie stron">
  <button class="arrow" id="prev" type="button" aria-label="Poprzednia strona">←</button>
  <div class="dots" id="dots" role="group" aria-label="Strony"></div>
  <button class="arrow" id="next" type="button" aria-label="Następna strona">→</button>
</nav>
<script>
{src('engine.js')}
{src('lib.js')}
{src('scenes.js')}
{src('page.js')}
</script>
'''
(R / 'index.html').write_text(html, encoding='utf-8')
print('index.html', len(html) // 1024, 'KB')
