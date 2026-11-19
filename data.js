/* Demo data — fictional brands (Pellstride running shoes, Tessmorrow linen dresses, Roastvelle coffee).
   All numbers are demo values. Every step mirrors a real Playad mobile-web flow checked on 2026-11-19.
   Each page load picks one brand + scenario at random (never the same as the last load in this browser),
   and texts with several versions ([[...], [...]]) pick one at random, so creators don't all film the same screens. */
(() => {
  const A = n => 'assets/' + n + '.jpg';
  const B = {
    pellstride: { name: 'Pellstride', domain: 'pellstride.com', unit: 'pairs', set: 'Prospecting · Running shoes', button: 'Shop now', budget: '$60/day' },
    tessmorrow: { name: 'Tessmorrow', domain: 'tessmorrow.com', unit: 'dresses', set: 'Prospecting · Summer dresses', button: 'Shop now', budget: '$50/day' },
    roastvelle: { name: 'Roastvelle', domain: 'roastvelle.com', unit: 'bags', set: 'Prospecting · Coffee subscribers', button: 'Subscribe', budget: '$40/day' }
  };

  // ---- shared flows for the other Action-needed cards ----
  const variationsFlow = (b, winner, img, cpa) => ({ chatTitle: 'Scale a Winning Ad Creative', avatar: 'casey', thinking: 'Planning variations of your winner',
    plan: [[`“${winner}” is your winner at **${cpa} per sale**. I’ll make **2 new images** in the same look and test them next to it:`, ['**Variation A:** same scene, tighter crop on the product', '**Variation B:** same scene, a new headline', '**Budget:** $10/day each, moved from your weakest ad'], 'The original keeps running as is.'],
           [`**${winner}** keeps beating your average (**${cpa} per sale**). Two fresh takes on it:`, ['**Variation A:** closer on the product', '**Variation B:** same look, different first line', '**Budget:** $10/day each, from your weakest ad'], 'Nothing else changes.']],
    q: 'Approve making and launching 2 variations?', action: `Test 2 variations of ${winner}`, actionSub: 'Ad 2 · Budget 1',
    desc: `Create 2 image variations of ${winner} and launch them in ${b.set} at $10/day each, moved from the weakest ad. Do not change the original ad.`,
    items: [{ img, kind: 'Ad · Image', name: `${winner} · Variation A`, state: 'Created' }, { img, kind: 'Ad · Image', name: `${winner} · Variation B`, state: 'Created' }],
    done: [['Done. **2 new variations are live** next to the original. You’ll see the comparison in tomorrow’s daily report.'], ['Both variations are **live** next to the original. Tomorrow’s 8:00 AM report will show which one wins.']] });
  const placementFlow = (b, place, bad, good, share, img) => ({ chatTitle: `Fix Costly ${place} Placement`, thinking: 'Comparing placement costs',
    plan: [[`${place} cost **${bad} per sale** vs. **${good} in Feed** over the last 7 days. Here’s the change:`, [`**${place}:** turn off in ${b.set}`, '**Other placements:** keep running', '**Total budget:** no change'], 'You’ll see in the daily report whether cost per sale comes down.'],
           [`${place} took **${share}** of spend but each sale there cost **${bad}**, against **${good}** in Feed.`, [`**Turn off:** ${place} in ${b.set}`, '**Keep:** Feed and the other placements', '**Budget:** unchanged']]],
    q: `Approve turning off ${place} in this ad set?`, action: `Turn off ${place} placement`, actionSub: 'Ad set 1',
    desc: `Remove the ${place} placement from ${b.set}. Keep other placements, total budget and targeting unchanged.`,
    items: [{ img, kind: 'Ad set · Placements', name: b.set, state: 'Created' }],
    done: [[`Done. **${place} is off** in ${b.set}. Total budget is unchanged.`], [`**${place} is turned off.** The rest of the ad set keeps running on the same budget.`]] });
  const budgetFlow = (b, from, fromImg, to, toImg) => ({ chatTitle: 'Move Budget to a Stronger Ad', thinking: 'Checking how much room it has',
    plan: [[`**${from}** spent $35 in the last 3 days with **1 sale**. **${to}** sells at half the cost. I’d move the money:`, [`**${from}:** −$15/day`, `**${to}:** +$15/day`, '**Total budget:** no change']],
           [`**${from}** has gone quiet: $35 spent, 1 sale in 3 days. I’d shift its budget to **${to}**:`, ['**Move:** $15/day', '**Total budget:** unchanged']]],
    q: `Approve moving $15/day to ${to}?`, action: `Move $15/day to ${to}`, actionSub: 'Budget 2',
    desc: `Lower ${from} by $15/day and raise ${to} by $15/day. Keep total budget unchanged.`,
    items: [{ img: fromImg, kind: 'Ad · Budget', name: from, state: 'Created' }, { img: toImg, kind: 'Ad · Budget', name: to, state: 'Created' }],
    done: [[`Done. **$15/day moved** from ${from} to ${to}. Total budget is unchanged.`]] });

  // ---- scenarios: [brand, cards, d1 (the fix), d2 (next-day report)] ----
  const S = [];
  const P = B.pellstride, T = B.tessmorrow, R = B.roastvelle;
  S.push({ b: P,
    cards: [
      { kind: 'Risk', title: '“Track Day · Video 2” is wasting spend — pause it and replace', detail: 'Seen 6.1× per person, cost per sale up from $24 to $41', cta: 'Pause & replace' },
      { kind: 'Opportunity', title: '“City Run · Video” is your winner — scale it while it works', detail: '$28 per sale for 5 days, below your $32 average', cta: 'Make variations', flow: variationsFlow(P, 'City Run · Video', A('ad_runner'), '$28') },
      { kind: 'Risk', title: 'Stories cost $39 per sale vs. $24 in Feed — turn off Stories', detail: 'Stories took 31% of spend in the last 7 days', cta: 'Turn off Stories', flow: placementFlow(P, 'Stories', '$39', '$24', '31%', A('ad_flatlay')) }],
    d1: { analysis: [['I checked the live account. **Track Day · Video 2** is the only ad running this creative. It cost **$41 per sale** yesterday, up from $24 a week ago, and people have now seen it **6.1 times** each.', 'Your other ads are steady at **$28–31 per sale**, so this one ad is wasting about **$40 a day**. I agree it should be paused and replaced.'],
                     ['Looked at the live numbers: **Track Day · Video 2** has run for 3 weeks and the same people keep seeing it, **6.1 times** each. Clicks fell **38%** and each sale now costs **$41**.', 'That’s about **$40 a day** above your other ads. Pausing and replacing it makes sense.']],
          fixIntro: [['Your best ad right now is **City Run · Video**: real runners and golden light. I’ll keep that look, use your product photos, and make 3 fresh versions to replace Video 2.'], ['People respond to **real runners outdoors** in your account. I’ll make 3 new images in that style from your product photos.']],
          making: 'Pellstride · Track Day refresh · Meta image ads',
          creatives: [{ img: A('v1'), title: 'Sunrise trail · 4:5', sub: 'Built for early miles' }, { img: A('v2'), title: 'Shoe on the ridge · 4:5', sub: 'Grip that holds' }, { img: A('v3'), title: 'Above the clouds · 4:5', sub: 'Run further' }],
          bad: 'Track Day · Video 2', badImg: A('ad_track'), badKind: 'Ad · Video' },
    d2: { headline: 'The new ads are working: “Sunrise trail” sold 9 pairs at $27 each. Video 2 was costing $41 before it was paused.',
          summary: [['**Daily report saved.** “Sunrise trail” brought **9 sales at $27 each**. Video 2 was costing **$41** before it was paused.', 'Next, I’d give it a little more budget while it’s winning.'], ['**Report saved.** The swap paid off: **Sunrise trail** sold **9 pairs at $27**, against **$41** for the paused Video 2.', 'It deserves a bit more budget.']],
          newName: 'Sunrise trail · Image', newImg: A('v1'), newCpa: '$27', sales: 9,
          rows: [['Ad spend', '$406', '$401', '▲ 1%', ''], ['Sales', '16', '15.2', '▲ 5%', 'good'], ['Cost per sale', '$25.38', '$26.38', '▼ 4%', 'good'], ['Clicks', '734', '690', '▲ 6%', 'good']],
          winner: 'City Run · Video', winnerImg: A('ad_runner'), winnerCpa: '$28', weak: 'Flat lay · Image', weakImg: A('ad_flatlay'),
          series: [[26, 29, 33, 36, 39, 41, null], [null, null, null, null, null, null, 27], [29, 28, 28, 27, 28, 28, 28]] } });
  S.push({ b: P,
    cards: [
      { kind: 'Risk', title: '“Flat lay · Image” is wasting spend — pause it and replace', detail: 'CTR 0.6% and $45 per sale, lowest in the account', cta: 'Pause & replace' },
      { kind: 'Opportunity', title: '“City Run · Video” is your winner — scale it while it works', detail: '$26 per sale this week, 30% below your average', cta: 'Make variations', flow: variationsFlow(P, 'City Run · Video', A('ad_runner'), '$26') },
      { kind: 'Risk', title: 'Reels cost $36 per sale vs. $22 in Feed — turn off Reels', detail: 'Reels took 27% of spend in the last 7 days', cta: 'Turn off Reels', flow: placementFlow(P, 'Reels', '$36', '$22', '27%', A('ad_track')) }],
    d1: { analysis: [['I checked the live account. **Flat lay · Image** gets a **0.6% CTR**, the lowest of your ads, and each sale costs **$45**.', 'Product-only shots get scrolled past in your account. Your ads with **a runner in the frame** sell at **$26–30**. I agree it should be replaced.'],
                     ['Live numbers: **Flat lay · Image** has the weakest click rate in the account (**0.6%**) and costs **$45 per sale**.', 'Your ads that show a person running do much better. Replacing it is the right call.']],
          fixIntro: [['I’ll replace it with 3 images that put **a runner and the shoe** in the same shot, using your product photos.'], ['New plan: same shoe, but **on the move**. I’ll make 3 action shots from your product photos.']],
          making: 'Pellstride · Flat lay refresh · Meta image ads',
          creatives: [{ img: A('ad_runner'), title: 'City sunrise run · 4:5', sub: 'Your morning, faster' }, { img: A('v3'), title: 'Trail runner · 4:5', sub: 'Run further' }, { img: A('hero'), title: 'The Tempo shoe · 4:5', sub: 'Light. Fast. Yours.' }],
          bad: 'Flat lay · Image', badImg: A('ad_flatlay'), badKind: 'Ad · Image' },
    d2: { headline: 'The new ads are working: “City sunrise run” sold 8 pairs at $29 each. Flat lay was costing $45 before it was paused.',
          summary: [['**Daily report saved.** “City sunrise run” brought **8 sales at $29 each**. Flat lay was costing **$45** before it was paused.', 'I’d watch it one more day, then add budget.'], ['**Report saved.** The runner shots work better: **City sunrise run** sold **8 pairs at $29**, against **$45** for the paused flat lay.']],
          newName: 'City sunrise run · Image', newImg: A('ad_runner'), newCpa: '$29', sales: 8,
          rows: [['Ad spend', '$398', '$402', '▼ 1%', ''], ['Sales', '15', '13.1', '▲ 15%', 'good'], ['Cost per sale', '$26.53', '$30.69', '▼ 14%', 'good'], ['Clicks', '702', '611', '▲ 15%', 'good']],
          winner: 'City Run · Video', winnerImg: A('ad_runner'), winnerCpa: '$26', weak: 'Track Day · Video 2', weakImg: A('ad_track'),
          series: [[44, 46, 43, 47, 45, 45, null], [null, null, null, null, null, null, 29], [28, 27, 26, 27, 26, 26, 26]] } });
  S.push({ b: T,
    cards: [
      { kind: 'Risk', title: '“Mannequin · Image” is wasting spend — pause it and replace', detail: 'CTR 0.5% and $52 per sale, lowest in the account', cta: 'Pause & replace' },
      { kind: 'Opportunity', title: '“Street style · Image” is your winner — scale it while it works', detail: '$31 per sale for 6 days, below your $38 average', cta: 'Make variations', flow: variationsFlow(T, 'Street style · Image', A('t_street'), '$31') },
      { kind: 'Risk', title: '“Flat lay · Image” is spending without sales — move its budget', detail: '$35 spent, 1 sale in the last 3 days', cta: 'Move budget', flow: budgetFlow(T, 'Flat lay · Image', A('t_flatlay'), 'Street style · Image', A('t_street')) }],
    d1: { analysis: [['I checked the live account. **Mannequin · Image** gets a **0.5% CTR** and each sale costs **$52**, the most expensive in the account.', 'Your ads that show the dress **on a person, outdoors** sell at **$31–34**. I agree it should be paused and replaced.'],
                     ['Live numbers: **Mannequin · Image** costs **$52 per sale** and almost nobody clicks it (**0.5%**).', 'The dress sells when people see it worn. Replacing this one makes sense.']],
          fixIntro: [['Your best ad is **Street style · Image**: the dress worn outside in warm light. I’ll make 3 new images in that style from your product photos.'], ['Same dress, but **worn and moving**. I’ll make 3 lifestyle shots from your product photos.']],
          making: 'Tessmorrow · Mannequin refresh · Meta image ads',
          creatives: [{ img: A('t_twirl'), title: 'Boardwalk twirl · 4:5', sub: 'Made for long summer days' }, { img: A('t_cafe'), title: 'Café afternoon · 4:5', sub: 'Linen that breathes' }, { img: A('t_fabric'), title: 'Linen close-up · 4:5', sub: 'Feel the difference' }],
          bad: 'Mannequin · Image', badImg: A('t_mannequin'), badKind: 'Ad · Image' },
    d2: { headline: 'The new ads are working: “Boardwalk twirl” sold 7 dresses at $30 each. Mannequin was costing $52 before it was paused.',
          summary: [['**Daily report saved.** “Boardwalk twirl” brought **7 sales at $30 each**. Mannequin was costing **$52** before it was paused.', 'I’d give it a little more budget while it’s winning.'], ['**Report saved.** Worn beats displayed: **Boardwalk twirl** sold **7 dresses at $30**, against **$52** for the paused mannequin shot.']],
          newName: 'Boardwalk twirl · Image', newImg: A('t_twirl'), newCpa: '$30', sales: 7,
          rows: [['Ad spend', '$352', '$348', '▲ 1%', ''], ['Sales', '11', '8.9', '▲ 24%', 'good'], ['Cost per sale', '$32.00', '$39.10', '▼ 18%', 'good'], ['Clicks', '588', '472', '▲ 25%', 'good']],
          winner: 'Street style · Image', winnerImg: A('t_street'), winnerCpa: '$31', weak: 'Flat lay · Image', weakImg: A('t_flatlay'),
          series: [[47, 49, 51, 50, 52, 52, null], [null, null, null, null, null, null, 30], [33, 32, 32, 31, 31, 31, 31]] } });
  S.push({ b: R,
    cards: [
      { kind: 'Risk', title: '“Laptop mug · Image” is wasting spend — pause it and replace', detail: 'Seen 5.4× per person, cost per signup up from $19 to $34', cta: 'Pause & replace' },
      { kind: 'Opportunity', title: '“Pour-over · Image” is your winner — scale it while it works', detail: '$17 per signup for 5 days, below your $24 average', cta: 'Make variations', flow: variationsFlow(R, 'Pour-over · Image', A('r_pourover'), '$17') },
      { kind: 'Risk', title: 'Stories cost $31 per signup vs. $18 in Feed — turn off Stories', detail: 'Stories took 33% of spend in the last 7 days', cta: 'Turn off Stories', flow: placementFlow(R, 'Stories', '$31', '$18', '33%', A('r_bag')) }],
    d1: { analysis: [['I checked the live account. **Laptop mug · Image** has run for 4 weeks and people have seen it **5.4 times** each. Each new subscriber now costs **$34**, up from $19.', 'Your other ads bring subscribers at **$17–22**. I agree it should be paused and replaced.'],
                     ['Live numbers: **Laptop mug · Image** is worn out. Same people, **5.4 views** each, and a subscriber now costs **$34** instead of $19.', 'That’s well above your other ads. Pausing and replacing it makes sense.']],
          fixIntro: [['Your best ad is **Pour-over · Image**: close, warm, steam rising. I’ll make 3 new images in that style from your product photos.'], ['People stop for **brewing moments** in your account. I’ll make 3 new shots like that from your product photos.']],
          making: 'Roastvelle · Laptop mug refresh · Meta image ads',
          creatives: [{ img: A('r_beans'), title: 'Fresh roast · 4:5', sub: 'Roasted this week' }, { img: A('r_mug'), title: 'Morning latte · 4:5', sub: 'Your slow morning' }, { img: A('r_iced'), title: 'Iced on the patio · 4:5', sub: 'Cold brew season' }],
          bad: 'Laptop mug · Image', badImg: A('r_laptop'), badKind: 'Ad · Image' },
    d2: { headline: 'The new ads are working: “Fresh roast” brought 12 subscribers at $18 each. Laptop mug was costing $34 before it was paused.',
          summary: [['**Daily report saved.** “Fresh roast” brought **12 signups at $18 each**. Laptop mug was costing **$34** before it was paused.', 'Next, I’d give it a little more budget while it’s winning.'], ['**Report saved.** The refresh worked: **Fresh roast** brought **12 subscribers at $18**, against **$34** for the paused laptop shot.']],
          newName: 'Fresh roast · Image', newImg: A('r_beans'), newCpa: '$18', sales: 12,
          rows: [['Ad spend', '$298', '$295', '▲ 1%', ''], ['Signups', '16', '12.4', '▲ 29%', 'good'], ['Cost per signup', '$18.63', '$23.79', '▼ 22%', 'good'], ['Clicks', '902', '774', '▲ 17%', 'good']],
          winner: 'Pour-over · Image', winnerImg: A('r_pourover'), winnerCpa: '$17', weak: 'Bag on counter · Image', weakImg: A('r_bag'),
          series: [[21, 24, 27, 29, 32, 34, null], [null, null, null, null, null, null, 18], [18, 17, 18, 17, 17, 17, 17]] } });

  // pick a scenario different from the last one this browser saw
  let last = -1; try { last = +localStorage.getItem('pd_scn'); } catch (e) {}
  let k = Math.floor(Math.random() * S.length); if (S.length > 1 && k === last) k = (k + 1) % S.length;
  const forced = +new URLSearchParams(location.search).get('s'); if (forced >= 1 && forced <= S.length) k = forced - 1;
  try { localStorage.setItem('pd_scn', String(k)); } catch (e) {}
  const s = S[k], b = s.b, d = s.d1, e = s.d2;
  const short = d.bad.split(' · ')[0], newShort = e.newName.split(' · ')[0];
  const per = b === R ? 'signup' : 'sale';

  window.DATA = {
    scenario: k + 1, brand: b,
    startChats: [`${b.name} brand kit setup`, 'First look at your Meta ads'],
    cardsText: s.cards,
    days: {
      1: {
        chatTitle: 'Review and Replace Underperforming Ad',
        analysis: d.analysis, fixIntro: d.fixIntro, making: d.making, setTitle: d.making, creatives: d.creatives,
        doneText: [['Done: 3 fresh versions, each in **4:5 for Feed** and **9:16 for Stories and Reels**:', d.creatives.map(c => c.title.replace(' · 4:5', ''))],
                   ['Here are 3 new versions, in **4:5** and **9:16**:', d.creatives.map(c => c.title.replace(' · 4:5', ''))]],
        plan: [['Here’s the plan:', [`**Pause:** “${d.bad}”`, `**Launch:** the 3 new ads in **${b.set}**`, `**Budget:** no change (${b.budget})`, `**Copy and button:** same as your current ads, **${b.button}**`], 'Your other ads and targeting stay as they are.'],
               ['What I’ll change:', [`Pause **${d.bad}**`, `Launch the **3 new ads** in ${b.set}`, `Keep budget at **${b.budget}** and the **${b.button}** button`]]],
        approveQ: `Approve pausing ${short} and launching these 3 ads?`,
        applying: 'Updating your Meta ads now.',
        actionSub: 'Ad 3 · Paused 1',
        applied: [[`Done. **“${d.bad}” is paused** and the **3 new ads are live**. Budget is unchanged.`, 'You’ll see how they did in tomorrow’s 8:00 AM daily report.'],
                  [`All set: **${short}** is paused, **3 new ads are running**, same budget.`, 'Tomorrow’s 8:00 AM report will show how they’re doing.']],
        panel: {
          title: `Pause ${d.bad}, launch 3 fresh ads`, meta: `${b.name} · Nov 19, 8:04 AM`,
          desc: `Pause “${d.bad}”. Launch the 3 approved images in ${b.set} with the current copy, ${b.button} button, destination and tracking. Do not change budget or targeting.`,
          items: [{ img: d.badImg, kind: d.badKind, name: d.bad, state: 'Paused' }].concat(d.creatives.map(c => ({ img: c.img, kind: 'Ad · Image', name: c.title.replace(' · 4:5', ''), state: 'Created' })))
        },
        cards: s.cards.map(c => c.flow ? { flow: c.flow } : null)
      },
      2: {
        chatTitle: 'Daily performance report',
        hello: [[`I checked ${b.name}’s Meta ads for November 19 against the 7 days before.`], [`Here’s November 19 for ${b.name}, compared with the 7 days before.`]],
        hello2: [[`Yesterday’s change is in the numbers: the 3 new ads replaced ${d.bad} for a full day.`], [`This is the first full day without ${d.bad}.`]],
        report: {
          cardTitle: 'Meta Daily Performance — November 19, 2026',
          title: 'Meta daily performance — November 19, 2026', date: '2026-11-19',
          headline: e.headline,
          judgement: 'One day is early, so watch it one more day before moving more budget.',
          action: `Give “${newShort}” +$15/day while it keeps beating your average.`,
          rows: e.rows,
          chart: { title: `Cost per ${per} by ad`, prefix: '$', max: 60, labels: ['11.13', '11.14', '11.15', '11.16', '11.17', '11.18', '11.19'],
            series: [{ name: `${d.bad} (paused)`, color: '#e5484d', v: e.series[0] }, { name: e.newName, color: '#3e9b6f', v: e.series[1] }, { name: e.winner, color: '#594fed', v: e.series[2] }] },
          ads: [{ img: e.newImg, name: e.newName, note: `New · ${e.sales} ${per}s`, cpa: `${e.newCpa} / ${per}`, tone: 'good' },
                { img: e.winnerImg, name: e.winner, note: 'Steady', cpa: `${e.winnerCpa} / ${per}`, tone: '' },
                { img: d.badImg, name: d.bad, note: 'Paused yesterday', cpa: '—', tone: '' }]
        },
        summary: e.summary,
        recs: [{ kind: 'Opportunity', title: `“${e.newName}” is a new winner — scale it while it works`, detail: `${e.sales} ${per}s at ${e.newCpa} each on day one.`, cta: 'Increase budget',
          flow: { thinking: 'Checking how much room it has',
            plan: [[`“${newShort}” brought **${e.sales} ${per}s at ${e.newCpa}** on day one. I’d raise it gently:`, [`**${newShort}:** +$15/day`, `**From:** ${e.weak} (−$15/day)`, '**Total budget:** no change'], `If cost per ${per} goes up, it will show in the daily report.`]],
            q: `Approve moving $15/day to ${newShort}?`, action: `Move $15/day to ${newShort}`, actionSub: 'Budget 2',
            desc: `Raise ${e.newName} by $15/day and lower ${e.weak} by $15/day. Keep total budget unchanged.`,
            items: [{ img: e.newImg, kind: 'Ad · Budget', name: e.newName, state: 'Created' }, { img: e.weakImg, kind: 'Ad · Budget', name: e.weak, state: 'Created' }],
            done: [[`Done. **${newShort} gets +$15/day**, taken from ${e.weak.split(' · ')[0]}. Total budget is unchanged.`]] } }]
      }
    },
    answers: [
      { k: ['why', 'drop', 'down', 'worse'], a: [[`Mostly one ad: **${d.bad}**. Your other ads held steady. Replacing that one ad is the fastest fix.`]] },
      { k: ['budget', 'spend', 'money'], a: [[`Most of your budget is doing fine. About **$40 a day** goes to **${d.bad}**, which isn’t pulling its weight.`]] },
      { k: ['best', 'winner', 'top'], a: [[`Your best ad right now is **${e.winner}** at **${e.winnerCpa} per ${per}**.`]] },
      { k: [], a: [[`One ad is costing you more than it should: **${d.bad}**. It’s in Action needed. Tap it and I’ll handle the rest.`], ['Short version: most ads are fine, one isn’t. Check Action needed and tap the first card.']] }
    ]
  };
})();
