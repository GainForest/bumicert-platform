import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

const CountryForm = () => {
    const [country, setCountry] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        console.log("country", country);
        const jwt = localStorage.getItem("jwt");
        if (!jwt) {
            setMessage("You must be signed in.");
            return;
        }
        try {
            await axios.post("http://localhost:8000/api/user/country/", { country }, {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            setMessage("Country submitted!");
        } catch (err) {
            console.log("error", err);
            setMessage("Failed to submit country.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-xs mb-8">
            <label htmlFor="country" className="font-medium">Country Code (3 letters):</label>
            <input
                id="country"
                type="text"
                maxLength={3}
                minLength={3}
                value={country}
                onChange={e => setCountry(e.target.value.toUpperCase())}
                className="border rounded px-2 py-1"
                required
            />
            <Button type="submit">Submit</Button>
            {message && <p className="text-sm mt-2">{message}</p>}
        </form>
    );
};

export default CountryForm;