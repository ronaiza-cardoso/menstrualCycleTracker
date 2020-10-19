import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Keyboard,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import {Calendar} from 'react-native-calendars';

const MARKED_DATES_KEY = '@menstrualCycleTracker:marked_dates_key';

function Main() {
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState();
  const [text, setText] = useState();

  useEffect(() => {
    getMarkedDates();
  }, []);

  function getMarkedDates() {
    AsyncStorage.getItem(MARKED_DATES_KEY).then((item) => {
      if (item) {
        setMarkedDates(JSON.parse(item));
      }
    });
  }

  function saveMarkedDates(mk) {
    AsyncStorage.setItem(MARKED_DATES_KEY, JSON.stringify(mk));
  }

  function handleDayPressed({dateString}) {
    const defaultStyle = {
      startingDay: true,
      endingDay: false,
      color: '#ff2e31',
    };

    let newMarkedDates = {...markedDates};

    if (markedDates[dateString]) {
      delete newMarkedDates[dateString];
    } else {
      newMarkedDates = {
        ...markedDates,
        [dateString]: {
          periods: [defaultStyle],
        },
      };
    }

    saveMarkedDates(newMarkedDates);
    setMarkedDates(newMarkedDates);
  }

  function handleLongPress({dateString}) {
    setSelectedDate(dateString);
  }

  function handleNotes() {
    const defaultStyle = {
      startingDay: false,
      endingDay: true,
      color: '#5f9ea0',
    };

    let newMarkedDates = {...markedDates};
    const alreadySelectedDate = newMarkedDates[selectedDate];

    if (alreadySelectedDate) {
      newMarkedDates[selectedDate] = {
        ...alreadySelectedDate,
        periods: [...alreadySelectedDate.periods, defaultStyle],
      };
    } else {
      newMarkedDates = {
        ...markedDates,
        [selectedDate]: {
          periods: [defaultStyle],
        },
      };
    }

    setMarkedDates(newMarkedDates);
    saveMarkedDates(newMarkedDates);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.calendar}>
        <Calendar
          markedDates={markedDates}
          markingType="multi-period"
          onDayPress={(day) => handleDayPressed(day)}
          onDayLongPress={(day) => handleLongPress(day)}
          onMonthChange={() => {
            setText();
            setSelectedDate();
          }}
        />
      </View>
      <View style={styles.notes}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Adicionar Notas ao dia{' '}
            {selectedDate ? new Date(selectedDate).toLocaleDateString() : '...'}
          </Text>
        </View>
        <TextInput
          multiline={true}
          numberOfLines={4}
          onChangeText={(t) => setText(t)}
          value={text}
          style={styles.textInput}
          onSubmitEditing={() => {
            handleNotes();
            Keyboard.dismiss();
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  calendar: {
    marginVertical: 10,
  },
  notes: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 16,
  },
  title: {
    color: '#333',
    fontSize: 25,
  },
  textInput: {
    height: 200,
    width: '100%',
  },
  bottomLine: {
    backgroundColor: 'salmon',
    width: '100%',
    bottom: 0,
    height: 1,
    position: 'absolute',
  },
  textContainer: {
    position: 'relative',
  },
});

export default Main;
