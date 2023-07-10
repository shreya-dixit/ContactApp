/* eslint-disable prettier/prettier */
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
import {useNavigation, useRoute} from '@react-navigation/native';
let db = openDatabase({name: 'contactDatabase.db'});
const Editcontact = () => {
  const route = useRoute();
  console.log(route.params.data);
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [contactnumber, setContactNumber] = useState(route.params.data.contactnumber);
  const [landlinenumber, setLandLineNumber] = useState(route.params.data.landlinenumber);
  const updatecontact = () => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE table_contact set name=?, contactnumber=? , landlinenumber=? where contact_id=?',
        [name, contactnumber, landlinenumber, route.params.data.id],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'Contact updated successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('Home'),
                },
              ],
              {cancelable: false},
            );
          } else alert('Updation Failed');
        },
      );
    });
  };
  useEffect(() => {
    setName(route.params.data.name);
    setContactNumber(route.params.data.contactnumber);
    setLandLineNumber(route.params.data.landlinenumber);
  }, [route.params.data.contactnumber, route.params.data.landlinenumber, route.params.data.name]);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter Contact Name"
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
        placeholder="Enter landlinenumber"
        value={landlinenumber}
        onChangeText={txt => setLandLineNumber(txt)}
        style={[styles.input, {marginTop: 20}]}
      />
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => {
          updatecontact();
        }}>
        <Text style={styles.btnText}>Save Contact</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Editcontact;
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