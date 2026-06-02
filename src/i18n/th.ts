const th = {
  toolbar: {
    stash: "⬇ เก็บงาน (Stash)",
    pop: "⬆ ดึงกลับ ({{count}})",
    reset: "↺ รีเซ็ต",
    theme: "ธีม",
    dev: "นักพัฒนา",
  },

  modules: {
    module1: "โมดูล 1 · ไทม์ไลน์เส้นตรง",
    module2: "โมดูล 2 · จักรวาลคู่ขนาน",
    module3: "โมดูล 3 · Cherry-pick",
    module4: "โมดูล 4 · Rebase",
    module5: "โมดูล 5 · Merge",
    module6: "โมดูล 6 · Merge Conflict",
    module7: "โมดูล 7 · git reset",
    module8: "โมดูล 8 · git stash",
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
      module1: { title: "โมดูล 1", subtitle: "ไทม์ไลน์เส้นตรง" },
      module2: { title: "โมดูล 2", subtitle: "จักรวาลคู่ขนาน" },
      module3: { title: "โมดูล 3", subtitle: "Cherry-pick" },
      module4: { title: "โมดูล 4", subtitle: "Rebase" },
      module5: { title: "โมดูล 5", subtitle: "Merge" },
      module6: { title: "โมดูล 6", subtitle: "Merge Conflict" },
      module7: { title: "โมดูล 7", subtitle: "git reset" },
      module8: { title: "โมดูล 8", subtitle: "git stash" },
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
  },
  intro: {
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

  moduleCard: {
    active: "กำลังเล่น",
    done: "✓ ผ่านแล้ว",
    locked: "ล็อก",
    inProgress: "กำลังดำเนินการ",
    clickToEnter: "คลิกเพื่อเข้า",
  },

  completion: {
    module1: {
      title: "ผ่านโมดูล 1 แล้ว!",
      body: "คุณเข้าใจประวัติแบบเส้นตรงแล้ว พร้อมเรียนรู้เรื่อง Branch หรือยัง?",
      button: "ปลดล็อกโมดูล 2",
    },

    module2: {
      title: "ผ่านโมดูล 2 แล้ว!",
      body1: "Branch เป็นเพียงตัวชี้ไปยัง commit ไม่ได้คัดลอกไฟล์ใด ๆ",
      body2: "ต่อไป: ย้าย commit เดียวข้าม branch ด้วย Cherry-pick",
      button: "ปลดล็อกโมดูล 3",
    },

    module3: {
      title: "Cherry-pick สำเร็จ!",
      body: "คุณคัดลอก commit ไปยัง main ได้แล้ว Hash เปลี่ยนเพราะถูกสร้างใหม่ ไม่ได้ถูกย้าย",
      button: "ปลดล็อกโมดูล 4",
    },

    module4: {
      title: "Rebase สำเร็จ!",
      body: "Commit ของ feature ถูกนำไปวางใหม่บน main สังเกตว่า ID เปลี่ยน เพราะประวัติถูกเขียนใหม่",
      button: "ปลดล็อกโมดูล 5",
    },

    module5: {
      title: "Merge สำเร็จ!",
      body: "คุณสร้าง merge commit ที่มี parent สองตัว ประวัติเดิมยังอยู่ครบ ต่างจาก rebase ที่จะเขียนใหม่",
      button: "ปลดล็อกโมดูล 6",
    },

    module6: {
      title: "แก้ Conflict สำเร็จ!",
      body: "คุณจัดการ merge conflict ได้แล้ว หลักการเดียวกับที่ใช้ใน Git จริง",
      button: "ปลดล็อกโมดูล 7",
    },

    module7: {
      title: "Reset สำเร็จ!",
      body: "git reset --hard ย้อน branch กลับไปและลบ commit ที่ตามมาทั้งหมด ต่างจาก revert ที่จะสร้าง commit ใหม่เพื่อย้อนการเปลี่ยนแปลง",
      button: "ปลดล็อกโมดูล 8",
    },

    module8: {
      title: "เชี่ยวชาญ git stash แล้ว!",
      body: "คุณเก็บงานค้างไว้ สลับไปแก้ปัญหา แล้วดึงงานกลับมาได้สำเร็จ จำไว้ว่า stash ทำงานเป็นแบบ Stack",
      button: "ไปยัง Sandbox",
    },

    attempts_one: "{{count}} ครั้ง",
    attempts_other: "{{count}} ครั้ง",
  },
};

export default th;
