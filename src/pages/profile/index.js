import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import './style.css';
import { Group } from "@material-ui/icons";
import { Favorite } from "@material-ui/icons";
import { StarBorder } from "@material-ui/icons";
import { Business } from "@material-ui/icons";
import { LocationOnOutlined } from "@material-ui/icons";
import { EmailOutlined } from "@material-ui/icons";
import { Link } from "@material-ui/icons";
import { Twitter } from "@material-ui/icons";
import { FiberManualRecord } from "@material-ui/icons";

export default function Profile() {
    const history =  useHistory();
    const [usuario, setUsuario] = useState('');
    const [repositorios, setRepositorios] = useState([]);
    const [usuarioStars, setUsuarioStars] = useState([]);

    function calculoData(repositorio) {
        let year = 'year';
        let month = 'month';
        let day = 'day';
        const dataAtual = new Date();
        const dataUpdateRepo = new Date(repositorio.updated_at);
        const diffTime = Math.abs(dataAtual - dataUpdateRepo);
        
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        let diffMonth = Math.floor(diffDays/30);
        let diffYear = Math.floor(diffMonth/12);

        if(diffYear>1) year='years';
        if(diffDays>1) day='days';
        if(diffMonth>1) month='months';

        if(diffYear>0) {
            diffMonth = diffMonth - 12*diffYear;
            if(diffMonth>1) month='months';
            return `Updated ${diffYear} ${year} and ${diffMonth} ${month} ago`;
        } else if(diffMonth>0) {
            return `Updated ${diffMonth} ${month} ago`;
        } else {
            return `Updated ${diffDays} ${day} ago`;
        }
    }

    useEffect(() => {
        function carregarDadosUsuario() {
            let usuarioPerfil = localStorage.getItem('usuario');
            let repositoriosGit = localStorage.getItem('repositorios')
            let usuarioStarred = localStorage.getItem('usuarioStars');
            
            usuarioPerfil = JSON.parse(usuarioPerfil);
            usuarioStarred = JSON.parse(usuarioStarred);
            repositoriosGit = JSON.parse(repositoriosGit);

            repositoriosGit.sort((a,b) => {
                return a.stargazers_count > b.stargazers_count ? -1 : a.stargazers_count < b.stargazers_count ? 1 : 0;
            })

            setUsuario(usuarioPerfil);
            setUsuarioStars(usuarioStarred);
            setRepositorios(repositoriosGit);
        }
        carregarDadosUsuario();
    }, [history]);

    return (
        <div className="flexDiv">
            <section className="sectionLeft">
                <img style={{width: '300px', height: '300px'}} src={usuario.avatar_url} alt="Foto do perfil do usuário"></img>
                <div style={{width: '100%'}}>

                    <div className="usuario">
                        <span className="nomeUsuario">{usuario.name}</span>
                        <span className="usernameUsuario">@{usuario.login}</span>
                        <span className="descricaoUsuario">{usuario.bio}</span>
                    </div>

                    <div className="infoUsuario">
                        <span> <Group style={{fontSize: 30}}/> {usuario.followers} followers </span>
                        <span> <Favorite style={{fontSize: 30}}/> {usuario.following} following </span>
                        <span> <StarBorder style={{fontSize: 30}}/> {usuarioStars.length} stars</span>
                    </div>

                    <div className="linksUsuario">
                        <span className={usuario.company? 'linkUsuario' : 'hide'}><Business style={{fontSize: 36, marginRight: '10px'}}/> {usuario.company}</span>
                        <span className={usuario.location? 'linkUsuario' : 'hide'}><LocationOnOutlined style={{fontSize: 36, marginRight: '10px'}}/> {usuario.location}</span>
                        <span className={usuario.email? 'linkUsuario' : 'hide'}><EmailOutlined style={{fontSize: 36, marginRight: '10px'}}/> {usuario.email}</span>
                        <span className={usuario.blog? 'linkUsuario' : 'hide'}><Link style={{fontSize: 36, marginRight: '10px'}}/> <a href={usuario.blog} target="_blank" rel="noreferrer"> {usuario.blog} </a></span>
                        <span className={usuario.twitter_username? 'linkUsuario' : 'hide'}><Twitter style={{fontSize: 36, marginRight: '10px'}}/> <a href={"https://twitter.com/" + usuario.twitter_username} target="_blank" rel="noreferrer"> @{usuario.twitter_username} </a></span>
                    </div>

                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <button className="buttonVoltar" onClick={() => history.push('/')}>Voltar</button>
                    </div>               
                </div>

            </section>
            <section className="sectionRight">
                {repositorios.map(repositorio => {
                    return (
                        <div key={repositorio.id}>
                            <h1 className="repositorioName"><a href={repositorio.html_url} target="_blank" rel="noreferrer">{repositorio.name}</a></h1>
                            <p className="descricaoRepositorio">{repositorio.description}</p>
                            <div className="infoRepositorio">
                                <span>
                                    <StarBorder />
                                    {repositorio.stargazers_count}
                                </span>
                                <span>
                                    <FiberManualRecord style={{fontSize: 10, marginRight: '10px'}}/>
                                    <ul>
                                        <li>{calculoData(repositorio)}</li>
                                    </ul>
                                </span>
                            </div>
                            <hr style={{border: '1px solid #ECEFF4', margin: '8px 10px'}}/>
                        </div>
                    )
                })}
            </section>
        </div>
    );
}