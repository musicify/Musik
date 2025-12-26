import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name muss mindestens 2 Zeichen haben"),
  email: z.string().email("Ungültige E-Mail-Adresse"),
  password: z
    .string()
    .min(8, "Passwort muss mindestens 8 Zeichen haben")
    .regex(/[A-Z]/, "Passwort muss einen Großbuchstaben enthalten")
    .regex(/[a-z]/, "Passwort muss einen Kleinbuchstaben enthalten")
    .regex(/\d/, "Passwort muss eine Zahl enthalten"),
  accountType: z.enum(["CUSTOMER", "DIRECTOR"]),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Ein Benutzer mit dieser E-Mail existiert bereits" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create user
    const user = await db.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.accountType,
      },
    });

    // Create profile based on account type
    if (validatedData.accountType === "CUSTOMER") {
      await db.customerProfile.create({
        data: {
          userId: user.id,
        },
      });
    } else if (validatedData.accountType === "DIRECTOR") {
      await db.directorProfile.create({
        data: {
          userId: user.id,
          specialization: [],
          badges: [],
        },
      });
    }

    return NextResponse.json(
      {
        message: "Benutzer erfolgreich erstellt",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

