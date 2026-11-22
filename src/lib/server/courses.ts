const sampleVideos = [
  'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
  'https://test-videos.co.uk/vids/sintel/mp4/h264/720/Sintel_720_10s_1MB.mp4',
  'https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4',
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  'https://download.samplelib.com/mp4/sample-10s.mp4'
];

export const instructor = {
  name: 'Håkon Trønnes',
  title: 'Anestesilege',
  initials: 'HT',
  photo_url: null,
  bio: 'Har jobbet som anestesilege i over 25 år, med erfaring fra både spesialisthelsetjeneste, luftambulanse og privat helsetjeneste.'
};

function lessons(prefix: string, items: [string, number, string][]) {
  return items.map(([title, minutes, description], index) => ({
    id: `${prefix}-${index + 1}`,
    title,
    minutes,
    description,
    video_url: sampleVideos[index % sampleVideos.length]
  }));
}

export const courses = [
  {
    slug: 'forstehjelp-3t',
    title: 'Grunnleggende førstehjelp',
    duration: '3 timer',
    format: 'Online, selvstudium',
    price_nok: 790,
    lookup_key: 'mediweb_forstehjelp_3t',
    summary: 'Et kompakt kurs som gir deg trygghet til å handle i akutte situasjoner — fra bevisstløshet til blødninger.',
    lessons: lessons('fh', [
      ['Vurdering av bevissthet og pust', 12, 'Slik får du raskt oversikt: er personen våken, og puster hen normalt?'],
      ['Stabilt sideleie', 9, 'Når og hvordan du legger en bevisstløs person som puster i stabilt sideleie.'],
      ['HLR på voksen', 18, 'Kompresjoner, innblåsninger og rytme — trinn for trinn.'],
      ['Stans av alvorlige blødninger', 14, 'Direkte trykk, trykkbandasje og når du bør vurdere tourniquet.'],
      ['Når og hvordan du ringer 113', 7, 'Hva AMK trenger å vite, og hvordan du gir god informasjon under stress.']
    ])
  },
  {
    slug: 'hlr-grunnkurs',
    title: 'HLR — grunnkurs',
    duration: '2 timer',
    format: 'Online + praktisk sertifisering',
    price_nok: 590,
    lookup_key: 'mediweb_hlr_grunn',
    summary: 'Hjerte- og lungeredning for ikke-helsepersonell. Følger norske retningslinjer fra NRR.',
    lessons: lessons('hg', [
      ['Hjertestansens kjede', 10, 'De fire leddene som avgjør om en hjertestans overleves.'],
      ['Kompresjon og innblåsing', 15, 'Riktig dybde, frekvens og forhold mellom kompresjoner og innblåsninger.'],
      ['Bruk av hjertestarter (AED)', 12, 'Hvordan du finner, åpner og bruker en hjertestarter trygt.'],
      ['Barn vs. voksen', 11, 'Viktige forskjeller når pasienten er et barn.']
    ])
  },
  {
    slug: 'hlr-helsepersonell',
    title: 'HLR for helsepersonell',
    duration: '4 timer',
    format: 'Online, med årlig fornying',
    price_nok: 1290,
    lookup_key: 'mediweb_hlr_helse',
    summary: 'Avansert HLR for deg som jobber i helsetjenesten. Inkluderer teamarbeid, medikamenter og arytmier.',
    lessons: lessons('hh', [
      ['Avansert luftveishåndtering', 20, 'Fra basale tiltak til supraglottiske luftveier og intubasjon.'],
      ['Rytmegjenkjenning', 18, 'Sjokkbare og ikke-sjokkbare rytmer i praksis.'],
      ['Medikamenter i akuttsituasjoner', 16, 'Adrenalin, amiodaron og annen sentral medikamentbruk.'],
      ['Lederskap i resuscitering', 14, 'Kommunikasjon, roller og closed-loop i teamet.']
    ])
  }
];

export type Course = (typeof courses)[number];
export type Lesson = Course['lessons'][number];

export function findCourse(slug: string): Course | undefined {
  return courses.find((course) => course.slug === slug);
}

export function publicCourse(course: Course) {
  return {
    slug: course.slug,
    title: course.title,
    duration: course.duration,
    format: course.format,
    price_nok: course.price_nok,
    summary: course.summary,
    modules: course.lessons.map((lesson) => lesson.title),
    lessons: course.lessons.map(({ id, title, minutes }) => ({ id, title, minutes })),
    instructor
  };
}

export function learningCourse(course: Course) {
  const { lookup_key: _lookupKey, ...safeCourse } = course;
  return safeCourse;
}

export function progressSummary(course: Course, completed: string[]) {
  const lessonIds = course.lessons.map((lesson) => lesson.id);
  const done = completed.filter((id) => lessonIds.includes(id));
  return {
    completed: done,
    total: lessonIds.length,
    percent: lessonIds.length ? Math.round((100 * done.length) / lessonIds.length) : 0
  };
}
