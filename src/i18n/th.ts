const th = {
  toolbar: {
    stash: "⬇ เก็บงาน (Stash)",
    pop: "⬆ ดึงกลับ ({{count}})",
    reset: "↺ รีเซ็ต",
    theme: "ธีม",
    dev: "นักพัฒนา",
    tabGraph: "กราฟ",
    tabHistory: "ประวัติ",
  },

  modules: {
    module0: "โมดูล 0 · เริ่มต้น",
    module1: "โมดูล 1 · ไทม์ไลน์เส้นตรง",
    module2: "โมดูล 2 · จักรวาลคู่ขนาน",
    module3: "โมดูล 3 · Cherry-pick",
    module4: "โมดูล 4 · Rebase",
    module5: "โมดูล 5 · Merge",
    module6: "โมดูล 6 · Merge Conflict",
    module7: "โมดูล 7 · git reset",
    module8: "โมดูล 8 · git stash",
    module9: "โมดูล 9 · Interactive Squash",
    module10: "โมดูล 10 · Detached HEAD",
    module11: "โมดูล 11 · Reflog Recovery",
    sandbox: "โหมด Sandbox",
  },

  sidebar: {
    levels: "ด่าน",
    session: "เซสชัน",
    noCommands: "ยังไม่มีคำสั่ง",
    docs: "เอกสาร",
    timeJustNow: "เมื่อสักครู่",
    timeSeconds: "{{count}} วินาทีที่แล้ว",
    timeMinutes: "{{count}} นาทีที่แล้ว",

    modules: {
      module0: { title: "โมดูล 0", subtitle: "เริ่มต้น" },
      module1: { title: "โมดูล 1", subtitle: "ไทม์ไลน์เส้นตรง" },
      module2: { title: "โมดูล 2", subtitle: "จักรวาลคู่ขนาน" },
      module3: { title: "โมดูล 3", subtitle: "Cherry-pick" },
      module4: { title: "โมดูล 4", subtitle: "Rebase" },
      module5: { title: "โมดูล 5", subtitle: "Merge" },
      module6: { title: "โมดูล 6", subtitle: "Merge Conflict" },
      module7: { title: "โมดูล 7", subtitle: "git reset" },
      module8: { title: "โมดูล 8", subtitle: "git stash" },
      module9: { title: "โมดูล 9", subtitle: "Interactive Squash" },
      module10: { title: "โมดูล 10", subtitle: "Detached HEAD" },
      module11: { title: "โมดูล 11", subtitle: "Reflog Recovery" },
      sandbox: {
        title: "โหมด Sandbox",
        subtitle: "พื้นที่อิสระ · ใช้งานได้ทุกคำสั่ง",
      },
    },
  },

  goalCard: {
    goal: "เป้าหมาย:",
    hint: "คำใบ้ ▸",
    guided: "โหมดสอน",
    sandbox: "Sandbox",
    attempts: "ลองไปแล้ว: {{count}} ครั้ง",
  },

  lessons: {
    init: {
      title: 'ด่าน 00 — commit แรกของคุณ',
      description: 'คุณมี repository ที่ว่างเปล่า สร้าง commit แรกเพื่อเริ่มติดตามประวัติ',
      hint: 'กดปุ่ม + เพื่อ stage การเปลี่ยนแปลง จากนั้น commit',
      chips: ['การกระทำ: commit แรก'],
    },
    linear: {
      title: "ด่าน 01 — ไทม์ไลน์เส้นตรง",
      description:
        "สร้าง commit เพิ่มอีก 4 ครั้ง เพื่อให้มีทั้งหมด 7 commits และดูว่า Git สร้างประวัติแบบเส้นตรงอย่างไร",
      hint: "กดปุ่ม + เพื่อสร้าง commit สังเกตว่า HEAD และ main จะเลื่อนไปข้างหน้าทุกครั้ง",
      chips: ["เป้าหมาย: 7 commits", "การกระทำ: commit"],
    },

    branch: {
      title: "ด่าน 02 — จักรวาลคู่ขนาน",
      description:
        "สร้าง branch ใหม่ แล้วเพิ่ม commit ลงใน branch นั้น โดยไม่แตะต้อง main",
      hint: "กดป้าย ⎇ บน commit ที่ HEAD ชี้อยู่เพื่อสร้าง branch จากนั้นกด + เพื่อ commit",
      chips: ["การกระทำ: branch + commit"],
    },

    "cherry-pick": {
      title: "ด่าน 03 — Cherry-pick",
      description:
        "ย้ายเฉพาะ commit f2 จาก feature มายัง main โดยไม่เอาทั้ง branch มาด้วย",
      hint: "ลาก commit f2 ไปวางบน c3 (ปลายของ main) ระบบจะแสดงตัวอย่างคำสั่ง git cherry-pick f2 ก่อนปล่อยเมาส์",
      chips: ["เป้าหมาย: main", "จำนวน commit ที่ย้าย: 1"],
    },

    rebase: {
      title: "ด่าน 04 — Rebase",
      description:
        "ย้าย branch feature ทั้งเส้นขึ้นไปต่อจากปลายของ main พร้อมเขียนประวัติใหม่ให้ดูเหมือนเริ่มจากตรงนั้นตั้งแต่แรก",
      hint: "ลากป้าย feature ไปวางบนปลายของ main สังเกตว่า ID ของ commit เปลี่ยนไป นั่นคือการ rewrite history",
      chips: ["ปลายทาง: main", "branch: feature"],
    },

    merge: {
      title: "ด่าน 05 — Merge",
      description:
        "รวม feature เข้ากับ main โดยสร้าง merge commit ที่เชื่อมประวัติทั้งสองฝั่งเข้าด้วยกัน โดยไม่เปลี่ยน ID ของ commit เดิม",
      hint: "ลากป้าย feature ไปวางบนป้าย branch ของ main แล้วดู merge commit ที่มี parent สองตัว",
      chips: ["เป้าหมาย: main", "branch: feature", "ผลลัพธ์: merge commit"],
    },

    conflict: {
      title: "ด่าน 06 — Merge Conflict",
      description:
        "ทั้งสอง branch แก้ไฟล์เดียวกัน ลอง merge feature เข้ากับ main แล้วเลือกวิธีแก้ conflict",
      hint: "ลาก feature ไปหา main ถ้าหน้าจอเป็นสีส้มแสดงว่าเกิด conflict จากนั้นเลือกวิธีแก้ในหน้าต่างที่แสดงขึ้น",
      chips: ["ไฟล์ที่ขัดแย้ง: greeting.txt", "วิธีแก้: เลือกเวอร์ชัน"],
    },

    reset: {
      title: "ด่าน 07 — git reset",
      description:
        "มี commit ทดลองที่ไม่ต้องการหลุดเข้ามาใน main ให้ย้อน main กลับไปที่ c3 และลบ commit ที่ผิดพลาดออกจากประวัติ",
      hint: "เอาเมาส์ไปชี้ที่ c3 แล้วกดปุ่ม ↺ reset commit ที่ผิดพลาดจะหายไป (--hard)",
      chips: ["โหมด: --hard", "เป้าหมาย: c3", "หายไป: c4, c5"],
    },

    stash: {
      title: "ด่าน 08 — git stash",
      description:
        "คุณมีงานค้างอยู่บน feature แต่ main ต้องการ hotfix ด่วน เก็บงานไว้ก่อน แก้ main แล้วค่อยดึงงานกลับมา",
      hint: "กด ⬇ Stash เพื่อเก็บงาน สลับไป main สร้าง commit แล้วกลับมา feature และกด Pop",
      chips: ["เก็บงาน", "แก้ main", "ดึงงานกลับ"],
    },
    squash: {
      title: "ด่าน 09 — Interactive Squash",
      description: "มี commit WIP สามตัวอยู่บน feature รวมมันเป็น commit เดียวก่อน merge",
      hint: "กดปุ่ม ⊕ squash ที่ปลาย feature ดู commit 3 ตัวรวมเป็น 1",
      chips: ["โหมด: -i squash", "เป้าหมาย: feature", "ก่อน: 3 commits", "หลัง: 1 commit"],
    },
    'detached-head': {
      title: "ด่าน 10 — Detached HEAD",
      description: "Checkout commit c2 โดยตรงเพื่อสำรวจอดีต — แล้ว reattach HEAD กลับไปที่ main",
      hint: "คลิก commit c2 เพื่อ checkout (HEAD จะหลุดออกจาก branch) จากนั้นคลิก label ของ main เพื่อ reattach",
      chips: ["ขั้นที่ 1: checkout c2", "ขั้นที่ 2: reattach ไปที่ main"],
    },
    reflog: {
      title: "ด่าน 11 — Reflog Recovery",
      description: "คุณ reset --hard ไปที่ c3 โดยไม่ตั้งใจ ทำให้ c4 และ c5 หายไป ใช้ reflog เพื่อกู้คืน commit ที่หายไป",
      hint: "กดปุ่ม Recover ถัดจาก c5 ใน reflog panel แล้ว commit ที่หายไปจะกลับมา",
      chips: ["หายไป: c4, c5", "เครื่องมือ: git reflog", "action: reset --hard <hash>"],
    },
  },
  intro: {
    module0: {
      title: "โมดูล 0 — เริ่มต้น",
      scenario: "คุณมีโฟลเดอร์ไฟล์แต่ยังไม่มีประวัติเวอร์ชันใดเลย คุณกำลังจะทำ Commit แรก — จุดที่โปรเจกต์เปลี่ยนจากแค่โฟลเดอร์ธรรมดาให้กลายเป็น Repository ที่ถูก Track แล้ว",
      concept: "`git init` สร้างโฟลเดอร์ `.git` ที่ซ่อนอยู่ภายในโฟลเดอร์ของคุณ โฟลเดอร์นั้นคือ Repository ทั้งหมด — มันเก็บทุก Snapshot, Branch และประวัติการเปลี่ยนแปลง ไม่มีอะไรนอกจากนั้นถูกแตะต้อง",
      keyInsight: "Git ทำงานแบบ Local-first ประวัติทั้งหมดอยู่บนเครื่องของคุณ GitHub, GitLab และ Bitbucket เป็นแค่กระจกสะท้อน — พวกมันโฮสต์สำเนาของโฟลเดอร์ `.git` ออนไลน์เพื่อให้ทีมทำงานร่วมกันได้",
    },
    module1: {
      title: "โมดูล 1 — ไทม์ไลน์เส้นตรง",

      scenario:
        "ทุกโปรเจกต์ล้วนมีจุดเริ่มต้น Git จะติดตามงานของคุณในรูปแบบของชุด Snapshot ที่เรียกว่า Commit แต่ละ Commit จะถูกบันทึกถาวร มีชื่ออ้างอิง และเชื่อมต่อกับ Commit ก่อนหน้า ทำให้คุณสามารถย้อนดูประวัติการเปลี่ยนแปลงทั้งหมดได้ตลอดเวลา",

      concept:
        "เมื่อคุณรัน `git commit` Git จะบันทึก Snapshot ของไฟล์ที่อยู่ใน Staging Area และเชื่อมมันเข้ากับ Commit ก่อนหน้า ทั้ง HEAD และชื่อ Branch จะชี้ไปยัง Commit ล่าสุด และเลื่อนไปข้างหน้าทุกครั้งที่มี Commit ใหม่",

      keyInsight:
        'Staging Area ทำหน้าที่เป็นตัวกลางระหว่างไฟล์ของคุณกับประวัติ Git คุณสามารถเลือกได้อย่างละเอียดว่าการเปลี่ยนแปลงใดจะถูกบันทึกใน Commit นั้น ๆ ทำให้แต่ละ Snapshot มีความหมาย แทนที่จะเป็นการกด "เซฟทุกอย่าง" ทีเดียว',
    },

    module2: {
      title: "โมดูล 2 — จักรวาลคู่ขนาน",

      scenario:
        "คุณอยากทดลอง Refactor ครั้งใหญ่ที่มีความเสี่ยง แต่ไม่อยากทำให้เวอร์ชันที่ใช้งานได้อยู่พัง วิธีที่ใช้จริงคือสร้าง Branch ใหม่ขึ้นมา เป็นพื้นที่ทำงานแยกที่คุณสามารถพัฒนา ทดสอบ หรือแม้แต่ลบทิ้งได้ โดยไม่กระทบกับ main",

      concept:
        "Branch เป็นเพียง Pointer ที่สามารถเลื่อนไปชี้ Commit อื่นได้ ไม่ได้มีการคัดลอกไฟล์ใด ๆ เมื่อคุณ Commit บน Branch นั้น Pointer ก็จะขยับไปยัง Commit ใหม่ ส่วนการสลับ Branch คือการย้าย HEAD ไปตาม Pointer อีกตัวหนึ่ง",

      keyInsight:
        "Branch มีต้นทุนต่ำมาก การสร้าง Branch ใช้เวลาเพียงเสี้ยววินาทีและไม่คัดลอกข้อมูลใด ๆ ต้นทุนที่แท้จริงอยู่ที่การ Merge ดังนั้นควรสร้าง Branch ตั้งแต่เนิ่น ๆ สร้างบ่อย ๆ และพยายามให้ Branch มีอายุสั้น",
    },

    module3: {
      title: "โมดูล 3 — Cherry-pick",

      scenario:
        "คุณแก้บั๊กสำคัญบน Feature Branch ได้แล้ว แต่ตัว Feature ยังไม่พร้อมปล่อย ในขณะที่ Production ต้องการบั๊กฟิกซ์นี้ทันที Cherry-pick ช่วยให้คุณนำเฉพาะ Commit นั้นมาใส่ใน main ได้ โดยไม่ต้องเอางานส่วนที่เหลือมาด้วย",

      concept:
        "`git cherry-pick <hash>` จะนำ Diff ของ Commit นั้น หรือก็คือการเปลี่ยนแปลงที่ Commit สร้างขึ้น มาประยุกต์ใช้อีกครั้งบนปลาย Branch ปัจจุบัน ผลลัพธ์คือ Commit ใหม่ที่มีเนื้อหาเหมือนเดิม แต่ได้ Hash ใหม่",

      keyInsight:
        "Commit ที่ได้จาก Cherry-pick เป็นคนละตัวกับต้นฉบับโดยสมบูรณ์ การลบ แก้ไข หรือ Rebase Commit ต้นฉบับภายหลัง จะไม่ส่งผลต่อ Commit ที่ถูก Cherry-pick มาแล้ว",
    },

    module4: {
      title: "โมดูล 4 — Rebase",

      scenario:
        "ระหว่างที่คุณพัฒนา Feature อยู่ คนอื่นก็ Merge งานเข้า main ไปเรื่อย ๆ จน Branch ของคุณตามหลัง แทนที่จะเพิ่ม Merge Commit ให้ประวัติดูซับซ้อน คุณอยากย้าย Commit ของตัวเองขึ้นไปต่อจาก main ล่าสุด ราวกับเริ่มต้นจากตรงนั้นมาตั้งแต่แรก",

      concept:
        "Rebase จะหา Common Ancestor ของทั้งสอง Branch จากนั้นยก Commit ของคุณออกจากฐานเดิม แล้วนำกลับไปวางใหม่ทีละตัวบน Branch เป้าหมาย Commit ทุกตัวจะได้รับ Hash ใหม่ เพราะ Parent ของมันเปลี่ยนไปแล้ว",

      keyInsight:
        "Rebase คือการเขียนประวัติใหม่ ห้าม Rebase Commit ที่คนอื่นดึงไปใช้งานแล้ว เพราะจะทำให้เกิดประวัติคนละเส้นและแก้ไขได้ยาก ใช้ Rebase กับงานในเครื่องของตัวเอง หรือ Branch ที่คุณเป็นเจ้าของเท่านั้น",
    },

    module5: {
      title: "โมดูล 5 — Merge",

      scenario:
        "Feature ของคุณเสร็จสมบูรณ์และผ่านการ Review แล้ว ตอนนี้คุณต้องการนำมันเข้ารวมกับ main โดยยังคงเก็บประวัติการพัฒนาไว้ครบถ้วนตามที่เกิดขึ้นจริง โดยไม่แก้ไขหรือเขียนประวัติใหม่",

      concept:
        "`git merge` จะสร้าง Merge Commit ใหม่ที่มี Parent สองตัว ตัวหนึ่งมาจากแต่ละ Branch Commit เดิมทั้งหมดจะไม่ถูกแก้ไข Git เพียงเพิ่ม Node ใหม่ที่เชื่อมประวัติของทั้งสองฝั่งเข้าด้วยกัน",

      keyInsight:
        "ต่างจาก Rebase การ Merge ไม่ทำลายหรือแก้ไขประวัติเดิม ไทม์ไลน์ทั้งสองจะถูกเก็บไว้ตามจริง ข้อแลกเปลี่ยนคือประวัติจะไม่เป็นเส้นตรง ทีมที่เน้นความสามารถในการตรวจสอบย้อนหลังมักเลือก Merge ส่วนทีมที่ชอบ Log สะอาด ๆ มักเลือก Rebase",
    },

    module6: {
      title: "โมดูล 6 — Merge Conflict",

      scenario:
        "นักพัฒนาสองคนแก้ไขบรรทัดเดียวกันของไฟล์เดียวกัน แต่ทำงานอยู่คนละ Branch เมื่อพยายาม Merge Git ไม่สามารถตัดสินได้ว่าเวอร์ชันไหนถูกต้อง จึงหยุดการทำงานและขอให้มนุษย์ช่วยตัดสินใจ",

      concept:
        "เมื่อ Git ตรวจพบการเปลี่ยนแปลงที่ขัดแย้งกันและไม่สามารถแก้ให้เองได้ มันจะหยุดกระบวนการ Merge ชั่วคราว พร้อมทำเครื่องหมายจุดที่มีปัญหาไว้ในไฟล์ คุณต้องเลือกว่าจะเก็บเวอร์ชันใด หรือผสมทั้งสองเวอร์ชันเข้าด้วยกัน ก่อนจึงจะ Merge ต่อได้",

      keyInsight:
        "Conflict เป็นเรื่องปกติ ไม่ใช่ความผิดพลาด มันคือ Git กำลังถามคุณในเรื่องที่มันไม่สามารถตัดสินใจแทนได้ ยิ่งทีมสื่อสารกันดีและแบ่งความรับผิดชอบของโค้ดชัดเจนเท่าไร ก็จะเกิด Conflict น้อยลงเท่านั้น",
    },

    module7: {
      title: "โมดูล 7 — git reset",

      scenario:
        "คุณเผลอ Commit งานทดลองที่ไม่ควรเข้าระบบลงบน main หลายตัว โชคดีที่ยังไม่มีใคร Pull ไปใช้งาน คุณจึงต้องการลบมันออกจากประวัติให้หมด ราวกับไม่เคยเกิดขึ้นมาก่อน",

      concept:
        "`git reset --hard <hash>` จะย้าย Pointer ของ Branch กลับไปยัง Commit ที่กำหนด และลบทุกอย่างที่อยู่หลังจากนั้นออก Commit เหล่านั้นจะหายไปจากประวัติ และ Working Tree จะถูกปรับให้ตรงกับสถานะของ Commit เป้าหมาย",

      keyInsight:
        "`--hard` เป็นการกระทำที่รุนแรงและไม่สามารถย้อนกลับได้ด้วยคำสั่ง Git ทั่วไป ควรใช้เฉพาะกับ Commit ที่ยังไม่ได้แชร์ให้คนอื่น หากเป็น Branch สาธารณะ ควรใช้ `git revert` ซึ่งจะสร้าง Commit ใหม่เพื่อย้อนการเปลี่ยนแปลงอย่างปลอดภัย",
    },

    module8: {
      title: "โมดูล 8 — git stash",

      scenario:
        "คุณกำลังทำ Feature อยู่ครึ่งทาง แต่มีบั๊กร้ายแรงเข้ามาแบบเร่งด่วน คุณต้องสลับ Branch ไปแก้ปัญหา แต่ก็ยังไม่พร้อม Commit งานที่ค้างอยู่",

      concept:
        "`git stash` จะเก็บการเปลี่ยนแปลงที่ยังไม่ได้ Commit ลงในพื้นที่ชั่วคราว และคืน Working Tree ให้สะอาดเหมือนเดิม จากนั้นคุณสามารถสลับ Branch ไปแก้บั๊ก กลับมา แล้วใช้ `git stash pop` เพื่อทำงานต่อจากจุดเดิมได้ทันที",

      keyInsight:
        "Stash ทำงานในลักษณะ Stack คุณสามารถ Stash ได้หลายครั้ง และ `git stash pop` จะดึงรายการล่าสุดกลับมาก่อนเสมอ ข้อมูลใน Stash จะยังอยู่แม้คุณจะสลับ Branch หรือปิด Terminal ไปแล้วก็ตาม",
    },
    module9: {
      title: "โมดูล 9 — Interactive Squash",

      scenario:
        "คุณทำ commit WIP ที่ยุ่งเหยิงสามตัวบน feature branch ก่อน merge เข้า main คุณต้องการรวมมันเป็น commit เดียวที่สะอาด ราวกับทำถูกตั้งแต่แรก",

      concept:
        "`git rebase -i HEAD~3` จะเปิด Editor แบบโต้ตอบให้คุณทำเครื่องหมาย commit ที่จะรวม Git จะรวมมันเป็นตัวเดียว ใช้ Timestamp ของ commit แรก และให้คุณเขียน Message ใหม่",

      keyInsight:
        "Squashing คือการเขียนประวัติใหม่ ห้ามทำกับ commit ที่คนอื่นดึงไปใช้แล้ว เก็บไว้ในเครื่องตัวเอง Commit log ที่สะอาดและมีความหมายจะ Review, Bisect และ Revert ได้ง่ายกว่าประวัติที่เต็มไปด้วย 'wip', 'fix typo', 'fix again'",
    },
    module10: {
      title: "โมดูล 10 — Detached HEAD",

      scenario:
        "คุณต้องการตรวจสอบ commit เก่าโดยไม่สร้าง branch ใหม่ คุณรัน `git checkout <hash>` แล้ว git เตือนว่า 'HEAD is now in detached state' — มันหมายความว่าอะไร?",

      concept:
        "HEAD ปกติชี้ไปที่ branch ซึ่งชี้ไปที่ commit เมื่อคุณ checkout commit hash โดยตรง HEAD จะชี้ที่ commit นั้นโดยตรง — 'หลุด' จาก branch ใดๆ commit ที่ทำในสถานะนี้จะกลายเป็น orphan เมื่อออกไป",

      keyInsight:
        "Detached HEAD มีประโยชน์สำหรับการสำรวจหรือทดสอบ ถ้าต้องการเก็บงานที่ทำในสถานะนี้ ให้สร้าง branch ทันที: `git checkout -b new-branch` ไม่เช่นนั้น reattach กับ branch ที่มีชื่อเพื่อกลับสู่ความปลอดภัย",
    },
    module11: {
      title: "โมดูล 11 — Reflog Recovery",

      scenario:
        "คุณรัน `git reset --hard` แล้ว commit หายไป ตื่นตกใจ แต่รอก่อน — git reset แค่ย้าย branch pointer เท่านั้น commit object จริงๆ ยังอยู่ใน repository ประมาณ 30 วัน",

      concept:
        "`git reflog` แสดงทุกที่ที่ HEAD เคยอยู่ — บันทึกเวลาของ branch checkout, commit, reset และ merge ค้นหา commit ที่หายไป คัดลอก hash แล้วรัน `git reset --hard <hash>` เพื่อกู้คืน",

      keyInsight:
        "Reflog คือตาข่ายนิรภัยของคุณ มันอยู่เฉพาะในเครื่อง (ไม่ถูก push) ดังนั้นจะช่วยได้แค่ตัวคุณเอง ไม่ใช่เพื่อนร่วมทีม garbage collector ของ Git จะลบ commit ที่ถูกทิ้งในที่สุด ดังนั้นรีบดำเนินการ",
    },
  },
  tooltips: {
    head: {
      title: 'HEAD',
      body: 'HEAD ชี้ไปที่ branch หรือ commit ที่คุณกำลังทำงานอยู่ คำสั่งอย่าง git commit จะอัปเดตตรงที่ HEAD ชี้อยู่',
      detached: 'HEAD หลุดออกจาก branch — กำลังชี้ตรงไปที่ commit hash ไม่ใช่ branch ถ้า commit ในสถานะนี้จะกลายเป็น orphan เมื่อเปลี่ยนไปที่อื่น',
      attached: 'HEAD ติดอยู่กับ branch "{{branch}}" — นี่คือ branch ที่คุณกำลังทำงานอยู่',
    },
    branch: {
      title: 'Branch: {{name}}',
      pointer: 'ชี้ไปที่ commit {{hash}}',
      headHere: 'HEAD อยู่ที่นี่ — นี่คือ branch ที่ใช้งานอยู่',
    },
    commit: {
      hash: 'Hash',
      branch: 'Branch',
      parents: 'Parents',
      message: 'Message',
    },
  },
  tickerSubtitles: {
    cherryPick: "คัดลอกเฉพาะการเปลี่ยนแปลงจาก commit นี้มายัง branch ปัจจุบัน",
    rebase: "นำ commit ของคุณมาเรียงใหม่บน branch เป้าหมายทีละตัว",
    merge: "เชื่อมประวัติทั้งสองฝั่งด้วย merge commit ใหม่",
  },
  explainer: {
    branchCreated: {
      title: "สร้าง Branch แล้ว",

      body: 'Git ได้สร้าง Pointer ใหม่ชื่อ "{{branch}}" ขึ้นมา โดยไม่มีการคัดลอกไฟล์ใด ๆ Branch เป็นเพียงป้ายที่ใช้ชี้ไปยัง Commit เท่านั้น ตอนนี้ HEAD จะติดตาม {{branch}} และเลื่อนไปข้างหน้าตามทุก Commit ใหม่ที่คุณสร้าง',
    },

    newCommit: {
      title: "สร้าง Commit ใหม่แล้ว",

      body: "Git ได้บันทึก Snapshot ของการเปลี่ยนแปลงที่อยู่ใน Staging Area และเพิ่มมันเป็น Node ใหม่ในกราฟประวัติ แต่ละ Commit จะมี Hash ที่ไม่ซ้ำกัน จึงทำให้ ID ดูเหมือนเป็นชุดตัวอักษรแบบสุ่ม",
    },

    cherryPick: {
      title: "Cherry-pick — เกิดอะไรขึ้นเมื่อกี้",

      steps: [
        "Git ดึง Diff ระหว่าง {{hash}} กับ Commit ก่อนหน้าของมันออกมา ซึ่งก็คือการเปลี่ยนแปลงที่ Commit นี้สร้างขึ้น",
        "การเปลี่ยนแปลงเหล่านั้นถูกนำไปใช้ซ้ำบนปลาย Branch ปัจจุบันของคุณ",
        "Git สร้าง Commit ใหม่ที่มี Diff เหมือนเดิม แต่ได้ Hash ใหม่ — การเปลี่ยนแปลงเหมือนเดิม แต่เป็น Commit คนละตัว",
      ],
    },

    rebase: {
      title: "Rebase — เกิดอะไรขึ้นเมื่อกี้",

      steps: [
        "Git หา Common Ancestor ของทั้งสอง Branch ซึ่งเป็นจุดล่าสุดที่ประวัติของทั้งคู่ยังเหมือนกัน",
        "Commit ของคุณถูกยกออกจากฐานเดิมทีละตัว",
        "แต่ละ Commit ถูกนำกลับไปวางใหม่บน {{onto}} และได้รับ Hash ใหม่ เพราะ Parent ของมันเปลี่ยนไปแล้ว",
      ],
    },

    mergeCommit: {
      title: "Merge Commit — เกิดอะไรขึ้นเมื่อกี้",

      steps: [
        "Git หา Common Ancestor ของทั้งสอง Branch",
        "การเปลี่ยนแปลงจากทั้งสองฝั่งถูกนำมารวมกัน โดยไม่มี Branch ใดถูกเขียนประวัติใหม่",
        "Git สร้าง Merge Commit ใหม่ที่มี Parent สองตัว และเก็บประวัติเดิมของทั้งสอง Branch ไว้ครบถ้วน",
      ],
    },

    hardReset: {
      title: "Hard Reset — เกิดอะไรขึ้นเมื่อกี้",

      steps: [
        "Git ย้าย Pointer ของ Branch กลับไปยัง {{target}}",
        "Commit ทุกตัวหลังจาก {{target}} ถูกลบออกจากประวัติ",
        "Working Tree ถูกปรับให้ตรงกับสถานะของ {{target}} ทำให้ไม่เหลือร่องรอยของ Commit ที่ถูกลบ",
      ],
    },

    workStashed: {
      title: "เก็บงานลง Stash แล้ว",

      body: "Git ได้บันทึกการเปลี่ยนแปลงที่ยังไม่ได้ Commit ลงใน Stack ชั่วคราว และล้าง Working Tree ให้สะอาด เพื่อให้คุณสามารถสลับ Branch ไปทำงานอื่นได้ทันที",
    },

    stashPopped: {
      title: "ดึงงานจาก Stash กลับมาแล้ว",

      body: "Git ได้นำ Snapshot ที่เก็บไว้ใน Stash กลับคืนสู่ Working Tree ของคุณ และลบรายการนั้นออกจาก Stash เรียบร้อยแล้ว",
    },
  },
  conflict: {
    title: "ตรวจพบ Merge Conflict",
    chooseResolution: "เลือกวิธีแก้",
    keepOurs: "ใช้ของเรา (main)",
    keepTheirs: "ใช้ของเขา (feature)",
    keepBoth: "เก็บทั้งสองฝั่ง",
    footer: "เมื่อเลือกแล้ว ระบบจะสร้าง merge commit",
  },

  toast: {
    complete: 'โมดูล {{n}} สำเร็จ! 🎉',
    hint: 'คลิกโมดูลถัดไปในแถบด้านข้าง →',
  },
  moduleCard: {
    active: "กำลังเล่น",
    done: "✓ ผ่านแล้ว",
    locked: "ล็อก",
    inProgress: "กำลังดำเนินการ",
    clickToEnter: "คลิกเพื่อเข้า",
  },
  commandPanel: {
    whatDoesThisDo: 'คำสั่งนี้ทำอะไร?',
    commands: {
      gitCommit: {
        title: 'git commit',
        description: 'บันทึกการเปลี่ยนแปลงที่ stage ไว้เป็น node ใหม่ในกราฟ HEAD และ branch ปัจจุบันจะเลื่อนไปยัง commit ใหม่',
      },
      gitCheckoutB: {
        title: 'git checkout -b',
        description: 'สร้าง branch pointer ใหม่และสลับไปยัง branch นั้นทันที ไม่มีการคัดลอกไฟล์ — branch คือแค่ label ที่เคลื่อนที่ได้',
      },
      gitCheckout: {
        title: 'git checkout',
        description: 'ย้าย HEAD ไปยัง branch หรือ commit hash ถ้าเป็น branch: HEAD จะติดตาม branch นั้น ถ้าเป็น hash: HEAD จะ detach — เข้าสู่โหมดสำรวจโดยไม่มี branch',
      },
      gitCherryPick: {
        title: 'git cherry-pick',
        description: 'คัดลอก diff ของ commit หนึ่งไปยังปลาย branch ปัจจุบัน สำเนาได้ hash ใหม่แต่มีการเปลี่ยนแปลงเหมือนกัน',
        steps: [
          'Git ดึงการเปลี่ยนแปลงที่แน่ชัดจาก commit ต้นทาง',
          'นำไปใช้ซ้ำบนปลาย branch ปัจจุบัน',
          'สร้าง commit ใหม่ที่มี diff เหมือนกันแต่ได้ hash ใหม่',
        ],
      },
      gitRebaseI: {
        title: 'git rebase -i (interactive squash)',
        description: 'แก้ไข commit หลายตัวแบบ interactive — squash รวม commit ที่ไม่เป็นระเบียบหลายตัวเป็น commit เดียวก่อน merge',
        steps: [
          'Git กำหนด commit ที่เลือกให้รวมเป็นหนึ่ง',
          'รวม diff ทั้งหมดเป็น commit เดียว',
          'กำหนด hash ใหม่ — ประวัติ local ถูกเขียนใหม่อย่างสะอาด',
        ],
      },
      gitRebase: {
        title: 'git rebase',
        description: 'ยก commit ออกจากฐานเดิมและนำไปใช้ซ้ำบน branch เป้าหมาย แต่ละ commit จะได้ hash ใหม่เพราะ parent เปลี่ยนไป',
        steps: [
          'Git หา ancestor ร่วมของทั้งสอง branch',
          'ยก commit ออกจากฐานเดิมทีละตัว',
          'นำ commit แต่ละตัวไปใช้ซ้ำบนปลายทาง — กำหนด hash ใหม่',
        ],
      },
      gitMerge: {
        title: 'git merge',
        description: 'รวมประวัติของสอง branch ด้วย merge commit ใหม่ที่มีสอง parent ไม่มี commit เดิมที่ถูกเขียนใหม่หรือย้าย',
        steps: [
          'Git หา ancestor ร่วมของทั้งสอง branch',
          'รวมการเปลี่ยนแปลงจากทั้งสองฝั่งโดยไม่เขียนใหม่',
          'สร้าง merge commit ที่มีสอง parent — ประวัติทั้งหมดถูกเก็บรักษาไว้',
        ],
      },
      gitResetHard: {
        title: 'git reset --hard',
        description: 'ย้าย branch pointer กลับไปยัง commit ที่ระบุ ทิ้งทุกอย่างหลังจากนั้นอย่างถาวร working tree จะถูก reset ให้ตรงกัน',
        steps: [
          'Branch pointer เลื่อนกลับไปยัง commit เป้าหมาย',
          'ทุก commit หลัง commit เป้าหมายถูกลบออกจากประวัติ',
          'Working tree ถูกทำความสะอาด — ไม่มีร่องรอยของ commit ที่หายไป',
        ],
      },
      gitStashPop: {
        title: 'git stash pop',
        description: 'คืนการเปลี่ยนแปลงที่ stash ไว้ล่าสุดกลับมาที่ working tree และลบ entry นั้นออกจาก stack',
      },
      gitStash: {
        title: 'git stash',
        description: 'บันทึกการเปลี่ยนแปลงที่ยังไม่ได้ commit ไปที่ stack ชั่วคราวและให้ working tree สะอาด เพื่อให้สลับ branch ได้อย่างปลอดภัย',
      },
      gitReflog: {
        title: 'git reflog',
        description: 'แสดงทุกที่ที่ HEAD เคยอยู่ — commits, checkouts, resets, merges ตาข่ายนิรภัยสำหรับกู้คืน commit ที่ดูเหมือนหายไปหลัง hard reset',
      },
    },
  },
  commandHistory: {
    empty: 'ยังไม่มีคำสั่ง — ลองโต้ตอบกับ canvas เพื่อดูประวัติที่นี่',
    graphDiff: 'graph diff',
    noGraphChange: 'ไม่มีการเปลี่ยนแปลงกราฟ',
  },
  docs: {
    labels: {
      theProblem: 'ปัญหา',
      howGitWorks: 'Git ทำงานอย่างไร',
      keyInsight: 'ข้อสังเกตสำคัญ:',
      commands: 'คำสั่ง',
    },
    modules: {
      module0: {
        commands: [
          { description: 'สร้าง repository ใหม่ในไดเรกทอรีปัจจุบันโดยสร้างโฟลเดอร์ .git ที่ซ่อนอยู่ โฟลเดอร์นี้คือ repository ทั้งหมด' },
          { description: 'Stage การเปลี่ยนแปลงทั้งหมดใน working tree เพื่อรอ commit ถัดไป' },
          { description: 'สร้าง snapshot แรก เนื่องจากไม่มี parent commit นี่เรียกว่า root commit — จุดยึดของประวัติทั้งหมด' },
        ],
      },
      module1: {
        commands: [
          { description: 'Stage การเปลี่ยนแปลงทั้งหมดใน working tree เพื่อรอ commit ถัดไป' },
          { description: 'บันทึกการเปลี่ยนแปลงที่ stage เป็น node ใหม่ถาวรในกราฟประวัติ HEAD และ branch ปัจจุบันเลื่อนไปยัง commit ใหม่' },
        ],
      },
      module2: {
        commands: [
          { description: 'สร้าง branch pointer ใหม่และสลับไปทันที ไม่มีการคัดลอกไฟล์ — branch คือแค่ label ที่เคลื่อนที่ได้ซึ่งชี้ไปยัง commit' },
          { description: 'บน branch ใหม่ เลื่อนปลาย branch และ HEAD — โดยไม่กระทบ main' },
        ],
      },
      module3: {
        commands: [
          {
            description: 'คัดลอก diff ที่แน่ชัดของ commit หนึ่งไปยังปลาย branch ปัจจุบัน สำเนาได้ hash ใหม่ — การเปลี่ยนแปลงเหมือนกัน แต่เป็น identity ใหม่',
            steps: [
              'Git ดึงการเปลี่ยนแปลงที่แน่ชัดที่ commit ต้นทางนำมา',
              'นำไปใช้ซ้ำบนปลาย branch ปัจจุบัน',
              'สร้าง commit ใหม่ที่มี diff เหมือนกันแต่ hash ต่างกัน',
            ],
          },
        ],
      },
      module4: {
        commands: [
          {
            description: 'ยก commit ออกจากฐานเดิมและนำไปใช้ซ้ำทีละตัวบนเป้าหมาย ประวัติถูกเขียนใหม่ — hash ใหม่เพราะ parent เปลี่ยน',
            steps: [
              'Git หา common ancestor ของทั้งสอง branch',
              'ยก commit ออกจากฐานเดิมทีละตัว',
              'นำ commit แต่ละตัวไปใช้ซ้ำบนเป้าหมาย — parent ใหม่หมายถึง hash ใหม่',
            ],
          },
        ],
      },
      module5: {
        commands: [
          {
            description: 'รวมประวัติของสอง branch ด้วย merge commit ใหม่ที่มีสอง parent ไม่มี commit เดิมถูกเขียนใหม่หรือย้าย',
            steps: [
              'Git หา common ancestor ของทั้งสอง branch',
              'รวมการเปลี่ยนแปลงจากทั้งสองฝั่งโดยไม่แตะ commit ใดๆ',
              'สร้าง merge commit ที่มีสอง parent — ประวัติทั้งหมดถูกเก็บรักษาไว้',
            ],
          },
        ],
      },
      module6: {
        commands: [
          {
            description: 'เมื่อทั้งสอง branch แก้ไขบรรทัดเดียวกัน Git จะหยุดและทำเครื่องหมายการชน คุณเลือกว่าจะเก็บเวอร์ชันใด จากนั้น merge ต่อ',
            steps: [
              'Git ตรวจพบการเปลี่ยนแปลงที่ขัดแย้งกันซึ่งแก้ไขอัตโนมัติไม่ได้',
              'การ merge หยุดชั่วคราว — คุณตรวจสอบ conflict และเลือกวิธีแก้',
              'หลังแก้ไขแล้ว Git สร้าง merge commit ด้วยเนื้อหาที่คุณเลือก',
            ],
          },
        ],
      },
      module7: {
        commands: [
          {
            description: 'ย้าย branch pointer กลับไปยัง commit เป้าหมาย ทิ้งทุกอย่างหลังจากนั้นอย่างถาวร working tree จะถูก reset ให้ตรงกัน',
            steps: [
              'Branch pointer เลื่อนกลับไปยัง commit เป้าหมาย',
              'commit ทั้งหมดหลัง commit เป้าหมายถูกลบออกจากประวัติ',
              'Working tree ถูกทำความสะอาด — ไม่มีร่องรอยของ commit ที่หายไป',
            ],
          },
        ],
      },
      module8: {
        commands: [
          { description: 'บันทึกการเปลี่ยนแปลงที่ยังไม่ได้ commit ไปที่ stack ชั่วคราวและให้ working tree สะอาด — ปลอดภัยในการสลับ branch โดยไม่สูญเสียงาน' },
          { description: 'ย้าย HEAD ไปยัง branch ที่ระบุ อัปเดต working tree ให้ตรงกับปลาย branch นั้น' },
          { description: 'คืน snapshot ที่ stash ไว้ล่าสุดกลับมาที่ working tree และลบ entry นั้นออกจาก stack' },
        ],
      },
      module9: {
        commands: [
          {
            description: 'เปิด session การเขียนใหม่แบบ interactive Squash รวม commit ที่ไม่เป็นระเบียบ N ตัวให้เป็น commit เดียวที่สะอาดก่อน merge',
            steps: [
              'Git รวบรวม commit ในช่วงที่ระบุ',
              'commit ที่ squash มี diff รวมกันเป็น changeset เดียว',
              'commit ใหม่หนึ่งตัวแทนที่ทั้งหมด — ประวัติถูกเขียนใหม่อย่างสะอาด',
            ],
          },
        ],
      },
      module10: {
        commands: [
          { description: 'Checkout commit hash โดยตรง ทำให้ HEAD อยู่ใน detached state — ชี้ไปยัง commit เอง ไม่ใช่ branch commit ที่ทำที่นี่จะเป็น orphan เมื่อออกไป' },
          { description: 'ต่อ HEAD กลับเข้า branch ที่ระบุ กลับจาก detached state สู่การทำงาน branch ปกติ' },
        ],
      },
      module11: {
        commands: [
          { description: 'แสดงทุกตำแหน่งที่ HEAD เคยอยู่ — commits, checkouts, resets, merges ตาข่ายนิรภัยสำหรับหา commit ที่ดูเหมือนหายหลัง hard reset' },
          { description: 'ใช้ร่วมกับ reflog hash เพื่อคืน branch pointer ไปยัง commit ที่เคยเข้าถึงได้ นำ commit ที่หายกลับมาในประวัติ' },
        ],
      },
    },
  },

  welcome: {
    subtitle: 'ยินดีต้อนรับสู่',
    tagline: 'เรียนรู้ Git ด้วยการลงมือทำ — ทีละขั้นตอนอย่างเป็นภาพ',
    sections: {
      whatIsGit: {
        title: 'Git คืออะไร?',
        body: 'Git คือ <strong>ระบบควบคุมเวอร์ชัน</strong> — เครื่องมือที่ติดตั้งบนเครื่องของคุณเพื่อบันทึกทุกการเปลี่ยนแปลงในโค้ดตลอดเวลา มันบันทึกสแนปชอตที่เรียกว่า <em>commits</em> ให้คุณแยกสาขาเพื่อทดลองไอเดียแบบแยกต่างหาก และรวมหรือจัดเรียงงานกลับเข้าด้วยกัน',
      },
      whatDoesGitDo: {
        title: 'Git ทำอะไรได้บ้าง?',
        body: 'ทุกครั้งที่คุณ commit Git จะบันทึกสแนปชอตถาวรของโปรเจกต์ คุณสามารถย้อนกลับไปยังสแนปชอตใดก็ได้ ทำงานแบบขนานบน branch ต่าง ๆ และรวมทุกอย่างเข้าด้วยกันในภายหลัง — โดยไม่สูญเสียประวัติแม้แต่ครั้งเดียว',
      },
      gitVsGithub: {
        title: 'Git กับ GitHub',
        body: '<strong>Git</strong> คือเครื่องมือ — ทำงานบนเครื่องของคุณเอง ไม่ต้องใช้อินเทอร์เน็ต<br/><strong>GitHub</strong> (และ GitLab, Bitbucket ฯลฯ) คือเว็บไซต์ที่ <em>โฮสต์</em> repository ของ Git ไว้ออนไลน์ เพื่อให้ทีมแชร์และทำงานร่วมกันได้ GitHub เพิ่ม pull requests, issues และ CI เข้ามา — แต่การควบคุมเวอร์ชันพื้นฐานคือ Git นั่นเอง',
      },
    },
    getStarted: 'เริ่มเลย →',
  },
};

export default th;
