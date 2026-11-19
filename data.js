/* Demo data — fictional brand Pellstride (running shoes). All numbers are demo values.
   Every step mirrors a real Playad mobile-web flow checked on 2026-11-19. */
window.DATA = {
  startChats: ['Pellstride brand kit setup', 'First look at your Meta ads'],
  days: {
    1: {
      chatTitle: 'Review and Replace Underperforming Ad',
      // same template the real "Pause & replace" button sends
      autoPrompt: 'My creative "Track Day · Video 2" (META_ADS) was judged wasteful. Evidence: 9 sales at a $41.20 cost per sale, with frequency 6.1 and CTR down 38% this week, indicate a tired creative in the supplied read window. Review it, pause the ads running it if you agree, and generate a replacement that fixes the likely weakness.',
      analysis: ['I checked the live account. **Track Day · Video 2** is the only ad running this creative. It cost **$41 per sale** yesterday, up from $24 a week ago, and people have now seen it **6.1 times** each.', 'Your other ads are steady at **$28–31 per sale**, so this one ad is wasting about **$40 a day**. I agree it should be paused and replaced.'],
      fixIntro: ['Your best ad right now is **City Run · Video**: real runners and golden light. I’ll keep that look, use your product photos, and make 3 fresh versions to replace Video 2.'],
      making: 'Pellstride · Track Day refresh · Meta image ads',
      setTitle: 'Pellstride · Track Day refresh · Meta image ads',
      creatives: [
        { img: 'assets/v1.jpg', title: 'Sunrise trail · 4:5', sub: 'Built for early miles' },
        { img: 'assets/v2.jpg', title: 'Shoe on the ridge · 4:5', sub: 'Grip that holds' },
        { img: 'assets/v3.jpg', title: 'Above the clouds · 4:5', sub: 'Run further' }
      ],
      doneText: ['Done: 3 fresh versions, each in **4:5 for Feed** and **9:16 for Stories and Reels**:', ['Sunrise trail', 'Shoe on the ridge', 'Above the clouds']],
      plan: ['Here’s the plan:', ['**Pause:** “Track Day · Video 2”', '**Launch:** the 3 new ads in **Prospecting · Running shoes**', '**Budget:** no change ($60/day)', '**Copy and button:** same as your current ads, **Shop now**'], 'Your other ads and targeting stay as they are.'],
      approveQ: 'Approve pausing Video 2 and launching these 3 ads?',
      applying: 'Updating your Meta ads now.',
      actionSub: 'Ad 3 · Paused 1',
      applied: ['Done. **“Track Day · Video 2” is paused** and the **3 new ads are live**. Budget is unchanged.', 'You’ll see how they did in tomorrow’s 8:00 AM daily report.'],
      panel: {
        title: 'Pause Track Day · Video 2, launch 3 fresh ads', meta: 'Pellstride · Nov 19, 8:04 AM',
        desc: 'Pause “Track Day · Video 2”. Launch the 3 approved images in Prospecting · Running shoes with the current copy, Shop now button, destination and tracking. Do not change budget or targeting.',
        items: [
          { img: 'assets/ad_track.jpg', kind: 'Ad · Video', name: 'Track Day · Video 2', state: 'Paused' },
          { img: 'assets/v1.jpg', kind: 'Ad · Image', name: 'Sunrise trail', state: 'Created' },
          { img: 'assets/v2.jpg', kind: 'Ad · Image', name: 'Shoe on the ridge', state: 'Created' },
          { img: 'assets/v3.jpg', kind: 'Ad · Image', name: 'Above the clouds', state: 'Created' }
        ]
      },
      // Action needed cards on My (index 0 = fix flow above)
      cards: [
        null,
        { flow: { chatTitle: 'Scale a Winning Ad Creative', avatar: 'casey', thinking: 'Planning variations of your winner',
          autoPrompt: 'My creative "City Run · Video" (META_ADS) is a new winner. Evidence: $28 per sale for 5 days in a row, below the $32 account average. Make variations of it and test them next to the original.',
          plan: ['“City Run · Video” is your winner at **$28 per sale**. I’ll make **2 new images** from the same runners and light and test them next to it:', ['**Variation A:** “5:30 AM. City’s still asleep.”', '**Variation B:** “Built for the miles before work.”', '**Budget:** $10/day each, moved from Flat lay · Image'], 'The original keeps running as is.'],
          q: 'Approve making and launching 2 variations?', action: 'Test 2 variations of City Run', actionSub: 'Ad 2 · Budget 1',
          desc: 'Create 2 image variations of City Run · Video and launch them in Prospecting · Running shoes at $10/day each, moved from Flat lay · Image. Do not change the original ad.',
          items: [{ img: 'assets/ad_runner.jpg', kind: 'Ad · Image', name: 'City Run · Variation A', state: 'Created' }, { img: 'assets/ad_runner.jpg', kind: 'Ad · Image', name: 'City Run · Variation B', state: 'Created' }],
          done: ['Done. **2 new variations are live** next to the original. You’ll see the comparison in tomorrow’s daily report.'] } },
        { flow: { chatTitle: 'Fix Costly Stories Placement', thinking: 'Comparing placement costs',
          autoPrompt: 'My ad set "Prospecting · Running shoes" (META_ADS) has a costly placement. Evidence: Stories cost $39 per sale vs. $24 in Feed over the last 7 days and took 31% of spend. Review it and fix the placement if you agree.',
          plan: ['Stories cost **$39 per sale** vs. **$24 in Feed** over the last 7 days. Here’s the change:', ['**Stories:** turn off in Prospecting · Running shoes', '**Feed and Reels:** keep running', '**Total budget:** no change'], 'You’ll see in the daily report whether cost per sale comes down.'],
          q: 'Approve turning off Stories in this ad set?', action: 'Turn off Stories placement', actionSub: 'Ad set 1',
          desc: 'Remove the Stories placement from Prospecting · Running shoes. Keep Feed, Reels, total budget and targeting unchanged.',
          items: [{ img: 'assets/ad_flatlay.jpg', kind: 'Ad set · Placements', name: 'Prospecting · Running shoes', state: 'Created' }],
          done: ['Done. **Stories is off** in Prospecting · Running shoes. Feed and Reels keep running, and total budget is unchanged.'] } }
      ]
    },
    2: {
      chatTitle: 'Daily performance report',
      hello: 'I checked Pellstride’s Meta ads for November 19 against the 7 days before.',
      hello2: 'Yesterday’s change is in the numbers: the 3 new ads replaced Track Day · Video 2 for a full day.',
      report: {
        cardTitle: 'Meta Daily Performance — November 19, 2026',
        title: 'Meta daily performance — November 19, 2026', date: '2026-11-19',
        headline: 'The new ads are working: “Sunrise trail” sold 9 pairs at $27 each. Video 2 was costing $41 before it was paused.',
        judgement: 'Cost per sale for the account fell from $31.69 to $25.38. One day is early, so watch it before moving more budget.',
        action: 'Give “Sunrise trail” +$15/day while it keeps beating your average.',
        rows: [['Ad spend', '$406', '$401', '▲ 1%', ''], ['Sales', '16', '15.2', '▲ 5%', 'good'], ['Cost per sale', '$25.38', '$26.38', '▼ 4%', 'good'], ['Clicks', '734', '690', '▲ 6%', 'good']],
        chart: { title: 'Cost per sale by ad', prefix: '$', max: 50, labels: ['11.13', '11.14', '11.15', '11.16', '11.17', '11.18', '11.19'],
          series: [{ name: 'Track Day · Video 2 (paused)', color: '#e5484d', v: [26, 29, 33, 36, 39, 41, null] }, { name: 'Sunrise trail · Image', color: '#3e9b6f', v: [null, null, null, null, null, null, 27] }, { name: 'City Run · Video', color: '#594fed', v: [29, 28, 28, 27, 28, 28, 28] }] },
        ads: [{ img: 'assets/v1.jpg', name: 'Sunrise trail · Image', note: 'New · 9 sales', cpa: '$27 / sale', tone: 'good' },
              { img: 'assets/ad_runner.jpg', name: 'City Run · Video', note: 'Steady', cpa: '$28 / sale', tone: '' },
              { img: 'assets/ad_track.jpg', name: 'Track Day · Video 2', note: 'Paused yesterday', cpa: '—', tone: '' }]
      },
      summary: ['**Daily report saved.** “Sunrise trail” brought **9 sales at $27 each**. Video 2 was costing **$41** before it was paused.', 'Next, I’d give it a little more budget while it’s winning.'],
      recs: [
        { kind: 'Opportunity', title: '“Sunrise trail · Image” is a new winner — scale it while it works', detail: '9 sales at $27 each on day one, below your $32 average.', cta: 'Increase budget',
          flow: { thinking: 'Checking how much room it has', autoPrompt: 'Please continue with the recommended next step: give “Sunrise trail · Image” more budget while it beats the account average.',
            plan: ['“Sunrise trail” sold **9 pairs at $27** on day one. I’d raise it gently:', ['**Sunrise trail:** +$15/day ($20 → $35)', '**From:** Flat lay · Image (−$15/day)', '**Total budget:** no change'], 'If cost per sale goes above $32, it will show up in the daily report.'],
            q: 'Approve moving $15/day to Sunrise trail?', action: 'Move $15/day to Sunrise trail', actionSub: 'Budget 2',
            desc: 'Raise Sunrise trail · Image by $15/day and lower Flat lay · Image by $15/day. Keep total budget unchanged.',
            items: [{ img: 'assets/v1.jpg', kind: 'Ad · Budget', name: 'Sunrise trail · Image', state: 'Created' }, { img: 'assets/ad_flatlay.jpg', kind: 'Ad · Budget', name: 'Flat lay · Image', state: 'Created' }],
            done: ['Done. **Sunrise trail gets +$15/day**, taken from Flat lay. Total budget is unchanged.'] } }
      ]
    }
  },
  answers: [
    { k: ['why', 'drop', 'down', 'worse'], a: ['Mostly one ad. **“Track Day · Video 2”** got tired: people saw it 6 times each, so clicks fell and each sale cost **$41**. Your other ads held steady around **$28–31**.'] },
    { k: ['budget', 'spend', 'money'], a: ['You spent **$412** yesterday and got **13 sales** ($31.69 each). About **$40** of that went to the tired ad.'] },
    { k: ['best', 'winner', 'top'], a: ['Your best ad is **City Run · Video**: **$28 per sale** for 5 days straight.'] },
    { k: [], a: ['Yesterday you spent **$412** and got **13 sales**. One ad is tired and costing you about **$40 a day**. It’s in Action needed. Tap it and I’ll handle the rest.'] }
  ]
};
