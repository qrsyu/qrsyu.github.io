/*
  Art projects list.
  To add a new project:
    1. Put its images in dict/images/art/<folder>/
    2. Copy vr.html to <slug>.html (no edits needed inside it)
    3. Add one entry below.
       - slug:   must match the page file name (vr -> vr.html)
       - title:  name shown on hover and on the project page
       - cover:  the image used for the tile on the Visuals page
       - images: all images shown on the project page, in order
       - description: a list of paragraphs (HTML allowed) shown on the project page
*/
window.ART_PROJECTS = [
  {
    slug: "vr",
    title: "Nocturne Garden",
    cover: "dict/images/art/unreal-engine/13.png",
    images: [13, 12, 11, 10, 5, 6, 16, 7, 3, 4, 2, 15, 1, 8, 9, 14]
      .map(n => `dict/images/art/unreal-engine/${n}.png`),
    description: [
      // Paragraph 1: what the project is
      `A VR environment I designed during my internship at Motus VR in spring 2022.
       Built in Unreal Engine 4.27, it is the world of an endless running game:
       a night garden of glowing arches, moonlit orbs, statues and ruins.`,

      // Paragraph 2: your creative ideas -- replace the placeholder text below.
      // Some questions you could answer:
      //   - What feeling or mood did you want the player to have?
      //   - What inspired the night setting, the moon orbs, the gothic arches?
      //   - Why mix calm, dreamy parts with dark ones (fire, skeletons)?
      //   - How did designing for VR (scale, light, movement) shape your choices?
      // `[Creative statement — write your ideas here.]`
    ]
  }
];
