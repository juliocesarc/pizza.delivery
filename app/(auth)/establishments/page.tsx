import { redirect } from "next/navigation";
import EstablishmentsGrid from "./_components/establishments-grid";
import axios from "axios";
import { getAuthToken } from "@/utils/get-token";


export default async function EstablishmentsPage() {
    const token = await getAuthToken();

    const response = await axios.get(`${process.env.API_URL}/establishments`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status !== 200) {
        throw new Error("Falha ao buscar estabelecimentos");
    }

    const { establishments } =  response.data as {
        establishments: {
            id: string;
            name: string;
            phone: string;
            address: string;
        }[];
    };

    if (establishments.length === 1) {
        redirect(`/${establishments[0].id}/orders`);
    }

    return <EstablishmentsGrid establishments={establishments} />;
}