import React, { Component, createRef } from "react";
import _ from "lodash";
import moment from "moment";
import AuthContext from "../../contexts/AuthContext";
import { postRegister } from "../../api";
import FormTextInput from "../../components/form/text_input/FormTextInput";
import { disableRefs, enableRefs } from "../../helpers";

export class Register extends Component {
  // eslint-disable-next-line no-empty-pattern
  static contextType = AuthContext;

  // eslint-disable-next-line no-empty-pattern
  constructor({}, context) {
    super();

    this.state = {
      ui_errors_validations: {},
    };

    this.ref = {
      inputs: {
        name: createRef(),
        gender_male: createRef(),
        gender_female: createRef(),
        birthday: createRef(),
        email: createRef(),
        password: createRef(),
        password_confirmation: createRef(),
      },
      buttons: {
        register: createRef(),
      },
    };

    this.setAuthInfo = context.setAuthInfo;
  }

  register = () => {
    disableRefs([..._.values(this.ref.inputs), ..._.values(this.ref.buttons)]);

    this.setState({ ui_errors_validations: {} });

    let form = {
      name: this.ref.inputs.name.current.value,
      gender: this.ref.inputs.gender_male.current.checked ? 1 : 2,
      birthday: this.ref.inputs.birthday.current.value,
      email: this.ref.inputs.email.current.value,
      password: this.ref.inputs.password.current.value,
      password_confirmation:
        this.ref.inputs.password_confirmation.current.value,
    };
    postRegister(form)
      .then((res) => {
        this.setAuthInfo({
          auth: true,
          user: res.data.data.user,
        });
        localStorage.setItem("BEARER_TOKEN", res.data.data.token);
      })
      .catch((err) => {
        if (err.response.status === 422) {
          this.setState({
            ui_errors_validations: err.response.data.data.errors,
          });
        }
        enableRefs([
          ..._.values(this.ref.inputs),
          ..._.values(this.ref.buttons),
        ]);
      });
  };

  render() {
    return (
      <div className="pt-[54px]">
        <div className="container mx-auto py-4">
          <div className="card max-w-2xl mx-auto">
            <div className="card-header">
              <h1 className="text-lg font-semibold">Register</h1>
            </div>
            <div className="card-body">
              {this.state.ui_errors_login && (
                <div className="bg-red-500 p-3 rounded-md mb-4">
                  Your login credentials are wrong!
                </div>
              )}
              <FormTextInput
                label="Name"
                type="name"
                ref={this.ref.inputs.name}
                errors={this.state.ui_errors_validations.name}
              />
              <FormTextInput
                label="Birthday"
                type="date"
                max={moment().subtract(18, "years").format("YYYY-DD-MM")}
                value={moment().subtract(18, "years").format("YYYY-DD-MM")}
                ref={this.ref.inputs.birthday}
                errors={this.state.ui_errors_validations.birthday}
              />
              <div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold">Gender</label>
                  <div>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="1"
                        ref={this.ref.inputs.gender_male}
                        defaultChecked
                      />
                      Male
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="2"
                        ref={this.ref.inputs.gender_female}
                      />
                      Female
                    </label>
                  </div>
                </div>
                {!_.isEmpty(this.state.ui_errors_validations.gender) && (
                  <div>
                    {this.state.ui_errors_validations.gender.map(
                      (error, index) => {
                        return (
                          <div className="text-red-400 text-sm" key={index}>
                            {error}
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
              <FormTextInput
                label="Email"
                type="email"
                ref={this.ref.inputs.email}
                errors={this.state.ui_errors_validations.email}
              />
              <FormTextInput
                label="Password"
                type="password"
                ref={this.ref.inputs.password}
                errors={this.state.ui_errors_validations.password}
              />
              <FormTextInput
                label="Confirm Password"
                type="password"
                ref={this.ref.inputs.password_confirmation}
                errors={this.state.ui_errors_validations.password_confirmation}
              />
            </div>
            <div className="card-footer">
              <button
                className="btn btn-indigo"
                ref={this.ref.buttons.register}
                onClick={this.register}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
