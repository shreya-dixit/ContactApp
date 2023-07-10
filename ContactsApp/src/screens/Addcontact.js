import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {openDatabase} from 'react-native-sqlite-storage';
import {useNavigation} from '@react-navigation/native';
let db = openDatabase({name: 'contactDatabase.db'});
const Addcontact = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [contactnumber, setContactNumber] = useState('');
  const [landlinenumber, setLandLineNumber] = useState('');
  const savecontact = () => {
    console.log(name, contactnumber, landlinenumber);
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO table_contact (name, contactnumber, landlinenumber) VALUES (?,?,?)',
        [name, contactnumber, landlinenumber],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'You are Registered Successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('Home'),
                },
              ],
              {cancelable: false},
            );
          } else alert('Registration Failed');
        },
        error => {
          console.log(error);
        },
      );
    });
  };
  useEffect(() => {
    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_contact'",
        [],
        (tx, res) => {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_contact', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_contact(contact_id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20), contactnumber VARCHAR(50), landlinenumber VARCHAR(100))',
              [],
            );
          }
        },
        error => {
          console.log(error);
        },
      );
    });
  }, []);
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter Name"
        style={styles.input}
        value={name}
        onChangeText={txt => setName(txt)}
      />
      <TextInput
        placeholder="Enter Contact Number"
        value={contactnumber}
        onChangeText={txt => setContactNumber(txt)}
        style={[styles.input, {marginTop: 20}]}
      />
      <TextInput
        placeholder="Enter Landline Number"
        value={landlinenumber}
        onChangeText={txt => setLandLineNumber(txt)}
        style={[styles.input, {marginTop: 20}]}
      />
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => {
          savecontact();
        }}>
        <Text style={styles.btnText}>Save Contact</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Addcontact;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    width: '80%',
    height: 50,
    borderRadius: 10,
    borderWidth: 0.3,
    alignSelf: 'center',
    paddingLeft: 20,
    marginTop: 100,
  },
  addBtn: {
    backgroundColor: 'purple',
    width: '80%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    alignSelf: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
  },
});
