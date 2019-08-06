import React from 'react';
import ReactDOM from 'react-dom';
import Papa from 'papaparse';
import moment from 'moment';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';

import './styles.css';
import { analyse } from './utils/analysis';

import RelationshipsTable from './components/RelationshipsTable';
import RelationshipsChart from './components/RelationshipsChart';

class App extends React.Component {
  state = {
    data: {},
    analysis: {},
    emails: [],
    email: 'andrew@xyzinnovation.com',
  };

  componentDidMount() {
    Papa.parse(
      'https://uploads.codesandbox.io/uploads/user/9d090d16-f524-4995-ac73-79f6866e0560/3xnJ-sample_data.csv',
      {
        download: true,
        header: true,
        transformHeader: (header) => {
          const result = header
            .toLowerCase()
            .replace(/_([a-z])/, function(m) {
              return m.toUpperCase();
            })
            .replace(/_/, '');
          return result;
        },
        transform: (value, header) => {
          switch (header) {
            case 'sentAt':
            case 'insertedAt':
            case 'updatedAt':
              return moment(value);

            default:
              return value;
          }
        },
        complete: this.handleLoadDataComplete,
      },
    );
  }

  handleLoadDataComplete = (results) => {
    const data = results.data.splice(0, results.data.length - 1);

    const emailsMap = {};
    data.forEach((entry) => {
      emailsMap[entry.from] = true;
      emailsMap[entry.to] = true;
    });
    const emails = Object.keys(emailsMap).sort();
    const analysis = analyse(data, this.state.email);
    this.setState({ data, emails, analysis });
  };

  handleEmailChange = (event) => {
    const { data } = this.state;
    const email = event.target.value;
    const analysis = analyse(data, email);
    this.setState({
      analysis,
      email,
    });
  };

  render() {
    const { analysis, emails, email } = this.state;

    return (
      <div className="App">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl className="emailSelect">
              <InputLabel htmlFor="email">Email</InputLabel>
              <Select
                value={email}
                onChange={this.handleEmailChange}
                inputProps={{
                  name: 'email',
                  id: 'email',
                }}>
                {(emails || []).map((e) => (
                  <MenuItem key={e} value={e}>
                    {e}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <RelationshipsTable data={analysis.relationships} email={email} />
          </Grid>
          <Grid item xs={12}>
            <RelationshipsChart data={analysis.relationships} email={email} />
          </Grid>
        </Grid>
      </div>
    );
  }
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
