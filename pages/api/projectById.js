import db from "@/lib/firebase-admin";

export default async function handler(req, res) {
    const { projectId } = req.query;

    try {
        const doc = await db.collection("projects").doc(projectId).get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Project not found" });
        }

        return res.status(200).json({ id: doc.id, ...doc.data() });
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch project", details: error.message });
    }
}
