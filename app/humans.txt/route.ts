export async function GET() {
  const humansTxt = `/* TEAM */
  
Website: Musicify
Location: Berlin, Germany
Contact: info@musicify.de

/* SITE */

Standards: HTML5, CSS3, JavaScript, TypeScript
Components: React, Next.js, Tailwind CSS
Backend: Node.js, Supabase, PostgreSQL
Hosting: Vercel

/* THANKS */

To all the talented composers and musicians who make Musicify possible.
To the open-source community for amazing tools and libraries.
`;

  return new Response(humansTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

