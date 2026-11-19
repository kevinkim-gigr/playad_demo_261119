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
  // creative flow: plan -> make images -> show them -> approve launch (same order as the main replace flow)
  const variationsFlow = (b, winner, img, cpa, imgB) => ({ chatTitle: 'Scale a Winning Ad Creative', avatar: 'casey', thinking: 'Loading brand assets',
    plan: [[`“${winner}” is your winner at **${cpa} per sale**. I’ll make **2 new images** in the same look to test next to it.`], [`**${winner}** keeps beating your average (**${cpa} per sale**). I’ll make two fresh takes on it.`]],
    making: `${b.name} · ${winner.split(' · ')[0]} variations · Meta image ads`,
    creatives: [{ img, title: 'Variation A · 4:5', sub: 'Closer on the product' }, { img: imgB || img, title: 'Variation B · 4:5', sub: 'Same look, new first line' }],
    launchPlan: [['Here’s the plan:', ['**Launch:** both variations next to the original', '**Budget:** $10/day each, moved from your weakest ad', `**Copy and button:** same as the original, **${b.button}**`], 'The original keeps running as is.'],
                 ['What I’ll change:', ['Launch **Variation A** and **Variation B**', 'Fund them with **$10/day each** from your weakest ad', 'Leave the original untouched']]],
    q: 'Approve launching these 2 variations?', action: `Test 2 variations of ${winner}`, actionSub: 'Ad 2 · Ad 1 changed',
    desc: `Launch 2 image variations of ${winner} in ${b.set} at $10/day each, moved from the weakest ad. Do not change the original ad.`,
    items: [{ img, kind: 'Ad · Image', name: `${winner} · Variation A`, state: 'Created' }, { img: imgB || img, kind: 'Ad · Image', name: `${winner} · Variation B`, state: 'Created' }],
    done: [['Done. **2 new variations are live** next to the original. You’ll see the comparison in tomorrow’s daily report.'], ['Both variations are **live** next to the original. Tomorrow’s 8:00 AM report will show which one wins.']] });
  const placementFlow = (b, place, bad, good, share, img) => ({ chatTitle: `Fix Costly ${place} Placement`, thinking: 'Comparing placement costs',
    plan: [[`${place} cost **${bad} per sale** vs. **${good} in Feed** over the last 7 days. Here’s the change:`, [`**${place}:** turn off in ${b.set}`, '**Other placements:** keep running', '**Total budget:** no change'], 'You’ll see in the daily report whether cost per sale comes down.'],
           [`${place} took **${share}** of spend but each sale there cost **${bad}**, against **${good}** in Feed.`, [`**Turn off:** ${place} in ${b.set}`, '**Keep:** Feed and the other placements', '**Budget:** unchanged']]],
    q: `Approve turning off ${place} in this ad set?`, action: `Turn off ${place} placement`, actionSub: 'Ad set 1',
    desc: `Remove the ${place} placement from ${b.set}. Keep other placements, total budget and targeting unchanged.`,
    items: [{ img, kind: 'Ad set · Placements', name: b.set, state: 'Created' }],
    done: [[`Done. **${place} is off** in ${b.set}. Total budget is unchanged.`], [`**${place} is turned off.** The rest of the ad set keeps running on the same budget.`]] });
  // built-in card: "%q looks efficient but never got real budget — verify it in an isolated test" / "Run isolated test"
  const isolatedFlow = (b, name, img, cpa) => ({ chatTitle: 'Verify an Underfunded Ad in an Isolated Test', thinking: 'Digging into creative results',
    plan: [[`**${name}** sold at **${cpa}** on the little budget it got, but Meta never gave it a real share. Here’s a fair test:`, [`**New ad set:** ${b.set} · Test`, `**Ad:** ${name} only`, '**Budget:** $15/day for 5 days, moved from your weakest ad', '**Targeting:** same as the original'], 'Your other ads keep running as they are.'],
           [`**${name}** looks efficient (**${cpa}**) but has barely run. I’d test it on its own:`, ['A separate ad set with just this ad', '**$15/day** for 5 days, from your weakest ad', 'Same targeting as now']]],
    q: 'Approve setting up this isolated test?', action: `Isolated test for ${name}`, actionSub: 'Ad set 1 · Ad 1',
    desc: `Create a test ad set in ${b.set.split(' · ')[0]} with only ${name}, $15/day for 5 days, moved from the weakest ad. Keep targeting the same.`,
    items: [{ img, kind: 'Ad set', name: `${b.set} · Test`, state: 'Created' }, { img, kind: 'Ad · Image', name, state: 'Created' }],
    done: [[`Done. **${name}** now runs in its own test ad set at **$15/day**. The daily report will show if it holds up.`]] });
  const budgetFlow = (b, from, fromImg, to, toImg) => ({ chatTitle: 'Move Budget to a Stronger Ad', thinking: 'Reviewing recent ad performance',
    plan: [[`**${from}** spent $35 in the last 3 days with **1 sale**. **${to}** sells at half the cost. I’d move the money:`, [`**${from}:** −$15/day`, `**${to}:** +$15/day`, '**Total budget:** no change']],
           [`**${from}** has gone quiet: $35 spent, 1 sale in 3 days. I’d shift its budget to **${to}**:`, ['**Move:** $15/day', '**Total budget:** unchanged']]],
    q: `Approve moving $15/day to ${to}?`, action: `Move $15/day to ${to}`, actionSub: 'Ad 2 changed',
    desc: `Lower ${from} by $15/day and raise ${to} by $15/day. Keep total budget unchanged.`,
    items: [{ img: fromImg, kind: 'Ad · Budget', name: from, state: 'Created' }, { img: toImg, kind: 'Ad · Budget', name: to, state: 'Created' }],
    done: [[`Done. **$15/day moved** from ${from} to ${to}. Total budget is unchanged.`]] });

  // ---- scenarios: [brand, cards, d1 (the fix), d2 (next-day report)] ----
  const S = [];
  const P = B.pellstride, T = B.tessmorrow, R = B.roastvelle;
  S.push({ b: P,
    cards: [
      { kind: 'Risk', title: '“Track Day · Video 2” is wasting spend — pause it and replace', detail: '9 conversions at a $41.20 CPA, alongside a 3.1% CVR and frequency 6.1', cta: 'Pause & replace' },
      { kind: 'Opportunity', title: '“City Run · Video” is a new winner — scale it while it works', detail: 'CTR 2.3% and 21 conversions at CPA 28.10 over 5 read days', cta: 'Make variations', flow: variationsFlow(P, 'City Run · Video', A('ad_runner'), '$28', A('hero')) },
      { kind: 'Opportunity', title: '“Morning Mile · Image” looks efficient but never got real budget — verify it in an isolated test', detail: '4 conversions at a $22.10 CPA on $88 spend, a 6.4% CVR', cta: 'Run isolated test', flow: isolatedFlow(P, 'Morning Mile · Image', A('hero'), '$22') }],
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
      { kind: 'Risk', title: '“Flat lay · Image” is wasting spend — pause it and replace', detail: '7 conversions at a $45.10 CPA, alongside a 2.4% CVR and 0.6% CTR', cta: 'Pause & replace' },
      { kind: 'Opportunity', title: '“City Run · Video” is a new winner — scale it while it works', detail: 'CTR 2.5% and 24 conversions at CPA 26.40 over 7 read days', cta: 'Make variations', flow: variationsFlow(P, 'City Run · Video', A('ad_runner'), '$26', A('v1')) },
      { kind: 'Opportunity', title: '“Ridge Trail · Image” looks efficient but never got real budget — verify it in an isolated test', detail: '3 conversions at a $19.80 CPA on $59 spend, a 5.9% CVR', cta: 'Run isolated test', flow: isolatedFlow(P, 'Ridge Trail · Image', A('v2'), '$20') }],
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
      { kind: 'Risk', title: '“Mannequin · Image” is wasting spend — pause it and replace', detail: '6 conversions at a $52.30 CPA, alongside a 1.9% CVR and 0.5% CTR', cta: 'Pause & replace' },
      { kind: 'Opportunity', title: '“Street style · Image” is a new winner — scale it while it works', detail: 'CTR 2.1% and 17 conversions at CPA 31.20 over 6 read days', cta: 'Make variations', flow: variationsFlow(T, 'Street style · Image', A('t_street'), '$31', A('t_cafe')) },
      { kind: 'Opportunity', title: '“Café Afternoon · Image” looks efficient but never got real budget — verify it in an isolated test', detail: '3 conversions at a $24.30 CPA on $73 spend, a 5.2% CVR', cta: 'Run isolated test', flow: isolatedFlow(T, 'Café Afternoon · Image', A('t_cafe'), '$24') }],
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
      { kind: 'Risk', title: '“Laptop mug · Image” is wasting spend — pause it and replace', detail: '8 conversions at a $34.40 CPA, alongside a 3.6% CVR and frequency 5.4', cta: 'Pause & replace' },
      { kind: 'Opportunity', title: '“Pour-over · Image” is a new winner — scale it while it works', detail: 'CTR 2.8% and 26 conversions at CPA 17.20 over 5 read days', cta: 'Make variations', flow: variationsFlow(R, 'Pour-over · Image', A('r_pourover'), '$17', A('r_mug')) },
      { kind: 'Opportunity', title: '“Iced Coffee · Image” looks efficient but never got real budget — verify it in an isolated test', detail: '5 conversions at a $14.60 CPA on $73 spend, a 7.1% CVR', cta: 'Run isolated test', flow: isolatedFlow(R, 'Iced Coffee · Image', A('r_iced'), '$15') }],
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
        actionSub: 'Ad 3 · Ad 1 changed',
        applied: [[`Done. **“${d.bad}” is paused** and the **3 new ads are live**. Budget is unchanged.`, 'You’ll see how they did in tomorrow’s 8:00 AM daily report.'],
                  [`All set: **${short}** is paused, **3 new ads are running**, same budget.`, 'Tomorrow’s 8:00 AM report will show how they’re doing.']],
        panel: {
          title: `Pause ${d.bad}, launch 3 fresh ads`, meta: `${b.name} · Nov 19, 8:04 AM`,
          desc: `Pause “${d.bad}”. Launch the 3 approved images in ${b.set} with the current copy, ${b.button} button, destination and tracking. Do not change budget or targeting.`,
          items: [{ img: d.badImg, kind: d.badKind, name: d.bad, state: 'Updated' }].concat(d.creatives.map(c => ({ img: c.img, kind: 'Ad · Image', name: c.title.replace(' · 4:5', ''), state: 'Created' })))
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
          flow: { thinking: 'Reviewing recent ad performance',
            plan: [[`“${newShort}” brought **${e.sales} ${per}s at ${e.newCpa}** on day one. I’d raise it gently:`, [`**${newShort}:** +$15/day`, `**From:** ${e.weak} (−$15/day)`, '**Total budget:** no change'], `If cost per ${per} goes up, it will show in the daily report.`]],
            q: `Approve moving $15/day to ${newShort}?`, action: `Move $15/day to ${newShort}`, actionSub: 'Ad 2 changed',
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
