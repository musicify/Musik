export async function GET() {
  const securityTxt = `Contact: security@musicify.de
Expires: 2025-12-31T23:59:59.000Z
Preferred-Languages: de, en
Canonical: https://musicify.de/.well-known/security.txt
Policy: https://musicify.de/security-policy
`;

  return new Response(securityTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

