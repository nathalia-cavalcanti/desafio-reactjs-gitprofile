import './style.css';
import { useHistory } from 'react-router-dom';
import { Search } from '@material-ui/icons';
import { useState } from 'react';
import { useEffect } from 'react';

export default function Home() {
    const history = useHistory();
    const [usuario, setUsuario] = useState('');
    const [error, setError] = useState({
      error: false,
      message: ''
    })

    async function pesquisa() {
      let erro = false;

      await fetch(`https://api.github.com/users/${usuario}`)
      .then(response => {
        if(response.status === 404) {
          erro = true;
          throw Error('Usuário não encontrado! Tente Novamente.');
        }
        return response.json()
      })
      .then(response => {
        erro = false;
        setError({error: false, message: ''});
        localStorage.setItem('usuario', JSON.stringify(response));
      })
      .catch(err => {
        setError({error: true, message: err.message});
      });

      await fetch(`https://api.github.com/users/${usuario}/starred`)
      .then(response => response.json())
      .then(response => {
        localStorage.setItem('usuarioStars', JSON.stringify(response));
      })

      await fetch(`https://api.github.com/users/${usuario}/repos`)
      .then(response => response.json())
      .then(response => {
        localStorage.setItem('repositorios', JSON.stringify(response));
      });

      if(!erro) {
        history.push('/profile');
      }
    }

    return (
        <div className="container">
          <div>
            <p className="titulo">Search Devs</p>
            
            <div className="busca">
              <input 
              value={usuario} 
              className="inputbutton" 
              placeholder="Type the username here..."
              onFocus={() => setError({error: false, message: ''})}
              onChange={(e) => setUsuario(e.target.value)} 
              />
              <button 
              className="buttonn" 
              onClick={pesquisa}>
                <Search style={{width: '30px', height: '30px', margin: '5px'}} />
                <p>Search</p>
              </button>
            </div>
            <span className={error.error? 'mensagemErro' : 'hide'}>{error.message}</span>
          </div>
        </div>
    );
}