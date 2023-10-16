import React, {useEffect, useState} from 'react';
import Glossary from "./Glossary";
import {Container, List, Paper} from "@material-ui/core";
import "./App.css"
import AddGlossary from "./AddGlossary";
import {call} from "./service/ApiService";
import {API_BASE_URL} from "./app-config";

function Main() {

    const [glossaries, setGlossaries] = useState([]);

    const getGlossaries = async () => {
        const response = await ((await fetch(
            `${API_BASE_URL}/glossaries`
        )).json());
        setGlossaries(response.glossaries);
    }

    useEffect(() => {
        getGlossaries()
    }, []);

    const add = (glossary) => {
        call("/glossaries", "POST", glossary).then((response) => {
            const newGlossary = {
                id: response,
                title: glossary.title,
            }
            setGlossaries(prevGlossaries => ([...prevGlossaries, newGlossary]));
        })
    }

    const update = (glossary) => {
        call("/glossaries/" + glossary.id, "PUT", glossary);
        const newGlossaries = glossaries.map(e => {
            if (e.id === glossary.id) {
                e.title = glossary.title;
            }
            return e;
        });
        setGlossaries(newGlossaries);
    }

    const remove = (id) => {
        call("/glossaries/" + id, "DELETE", id);
        const newGlossaries = glossaries.filter((g) => g.id !== id);
        setGlossaries(newGlossaries);
    }

    return (
        <div className="Main">
            <Container maxWidth="md">
                <AddGlossary glossaries={glossaries} add={add}/>
                <div className="GlossaryList">
                    <Paper style={{margin: 16}}>
                        <List>
                            {glossaries.map((v) => (
                                <Glossary key={v.id} glossary={v} update={update} remove={remove}/>
                            ))}
                        </List>
                    </Paper>
                </div>
            </Container>
        </div>
    );

}

export default Main;
