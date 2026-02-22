function decodeJWT(token: string | undefined) {
    if (!token) return { error: "No token provided" };
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = Buffer.from(base64, 'base64').toString();
        return JSON.parse(jsonPayload);
    } catch (e) {
        return { error: "Failed to decode" };
    }
}

const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("Anon Key Payload:", JSON.stringify(decodeJWT(anonKey), null, 2));
console.log("Service Key Payload:", JSON.stringify(decodeJWT(serviceKey), null, 2));
console.log("Configured URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
