// Secrets
// Content revealed only through hidden interactions
// Nothing here should be reachable through normal navigation

export const secretKeySequenceReward = {
  id: "konami",
  title: "You found the sequence",
  message: "This does not unlock anything important, it just proves you tried the old trick and it still works here",
  reward: "a completely pointless badge that only you know about"
}

export const drawerSecret = {
  id: "drawer-compartment",
  title: "A hidden compartment",
  message: "Behind the socks there is a folded note that says call your friend back",
  reward: "one honest reminder disguised as a joke"
}

export const hiddenRoom = {
  id: "the-void",
  title: "Absolutely Nothing Important",
  description: "A tiny hidden room that exists purely because it can",
  contents: [
    "a sign that says you were not supposed to find this",
    "a counter that counts backwards from a number nobody chose",
    "a single sock with no explanation"
  ]
}
