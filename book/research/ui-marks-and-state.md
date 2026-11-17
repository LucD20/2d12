# The marks of a state on a game interface: shape, motion, grouping (2026-11-17)

**The question (Lucas, on the HUD remake's AP / Reaction AP / Strike marks):** "if it is out of turn, it becomes diamond, moving to the side etc or would that be too 'flashy' and more confusing? A thin vertical line would help see what is which too no?"

## Takeaways
1. **One mark, one meaning.** Nielsen's fourth heuristic, "Consistency and standards": users should not have to wonder whether different words, situations or actions mean the same thing; within one product the same thing keeps the same label, icon, color and place (the secondary guides that restate it agree). A mark that changes shape with the situation makes the reader ask what it means now. [lead: secondary summaries of the heuristic; NN/g's own page not opened]
2. **Motion is for the one thing that must be seen.** NN/g, "The Role of Animation and Motion in UX": "The big advantage (and also drawback) of UI motion is that it attracts user attention"; animation "must be unobtrusive, brief, and subtle"; "they should not be overused, as they can easily become overwhelming and distract users"; "Motion can be used to indicate that the interface switched to a different state". [read]
3. **Grouping by nearness, a boundary stronger still.** NN/g, "Proximity Principle in Visual Design": "Items close together are likely to be perceived as part of the same group"; proximity "can overpower competing visual cues such as similarity of color or shape"; whitespace unites or separates. Common region (a shared boundary) groups more strongly and can override proximity (NN/g's video; Palmer 1992, as cited by Laws of UX and others). [read; common region: lead]
4. **Two meanings in one shape, told apart by color only, fail twice:** the consistency heuristic and WCAG's "not by color alone" (`vtt-style.md`).
5. **Games keep the reaction a separate resource with its own mark** (Baldur's Gate 3: Action, Bonus Action and Reaction are three resources; reactions prompt on any creature's turn). [lead: bg3.wiki, Reaction (Resource)]

## How they apply to 2d12
- **The AP squares stay squares off turn.** By the rules (Ch. 2) kept AP can pay for a Reaction but are not Reaction AP: they become Guard at the next turn, the Reaction AP never does. Diamonds would say the wrong thing (takeaway 1).
- **Nothing moves at a turn change** (takeaway 2; Lucas's own "nothing jumps", 2026-11-12). Motion stays for a waiting Reaction (the ring on the map, the HUD's tab).
- **A hairline between AP, the Reaction AP and the Strikes** (takeaway 3; today's carousel already had one between AP and the Reaction AP).
- **Strikes get their own shape** (short slashes, tally marks), since the Reaction AP is the diamond (takeaway 4). Drawn: `foundry/mockups/hud2/index.html`, section 6b.

## Sources
- [NN/g: Proximity Principle in Visual Design](https://www.nngroup.com/articles/gestalt-proximity/) [read]
- [NN/g: The Role of Animation and Motion in UX](https://www.nngroup.com/articles/animation-purpose-ux/) [read]
- [NN/g video: Common Region](https://www.nngroup.com/videos/common-region-gestalt/) · [Laws of UX: Common Region](https://lawsofux.com/law-of-common-region/) [lead]
- Consistency and standards, secondary: [uxdesign.cc on the 4th heuristic](https://uxdesign.cc/jakob-nielsens-fourth-usability-heuristic-for-user-interface-design-7a25960037d1) · [Skill Wiki: Nielsen consistency](https://skill-wiki.github.io/atom/frontend-design/principle-nielsen-consistency) [lead]
- [bg3.wiki: Reaction (Resource)](https://bg3.wiki/wiki/Reaction_(Resource)) [lead]
