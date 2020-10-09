import React, {useState, useEffect} from 'react';
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";

export const AuthPage = () => {
    const message = useMessage();
    const {loading, request, error, clearError} = useHttp();
    const [form, setForm] = useState({
        email:'', password: ''
    });

    useEffect(() => {
        message(error);
    },[error,message, clearError]);

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };

    const registerHandler = async() => {
        try {
            const data = await request('/api/auth/register', 'POST', {...form});
            console.log('Data', data);
        } catch(e) {}
    };

    return (
      <div className="row">
          <div className="col s6 offset-s3">
              <h1>Shorten your link</h1>
              <div className="card blue darken-1">
                  <div className="card-content white-text">
                      <span className="card-title">Authorization</span>
                      <div>
                          <div className="input-field">
                              <input
                                  placeholder="Type email"
                                  id="email"
                                  type="text"
                                  name="email"
                                  className="yellow-input"
                                  onChange={changeHandler}
                              />
                                  <label htmlFor="email">Email</label>
                          </div>
                          <div className="input-field">
                              <input
                                  placeholder="Type password"
                                  id="password"
                                  type="password"
                                  name="password"
                                  className="yellow-input"
                                  onChange={changeHandler}
                              />
                              <label htmlFor="email">Email</label>
                          </div>
                      </div>
                  </div>
                  <div className="card-action">
                      <button
                          className="btn yellow darken-4"
                          style={{marginRight: 10}}
                          disabled={loading}
                      >
                          Sign in
                      </button>
                      <button
                          className="btn grey lighten-1 black-text"
                          onClick={registerHandler}
                          disabled={loading}
                      >
                          Sign up
                      </button>
                  </div>
              </div>
          </div>
      </div>
  );
};