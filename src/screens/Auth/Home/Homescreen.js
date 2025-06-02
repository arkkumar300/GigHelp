import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Card, Text, Chip } from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import styles from "./HomeStyle";
import HomeImage from "../assets/home.jpg"; // Adjust your image path
import AddTaskDetails from "../AddTask/TaskDdetails"; // You should create this component in RN

const HomeScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [filterTask, setFilterTask] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const navigation = useNavigation();
  const route = useRoute();

  const {
    selectedCategory,
    selectedSubCategory,
    budget,
    category,
    from,
    to,
  } = route?.params || {};

  const colors = [
    "#2196f3", "#4caf50", "#ff9800", "#e91e63", "#9c27b0",
    "#00bcd4", "#f44336", "#3f51b5", "#8bc34a", "#ffc107",
    "#795548", "#607d8b", "#673ab7", "#009688", "#cddc39",
  ];

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        if (!token) {
          console.log("Token missing");
          return;
        }

        const response = await axios.get("http://localhost:3001/task/get-all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setTasks(response.data.data);
          setFilterTask(response.data.data);
        }
      } catch (err) {
        console.error("API error:", err);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    let filtered = [...tasks];

    if (selectedCategory) {
      filtered = filtered.filter((task) => task.Categories === selectedCategory);
    }
    if (selectedSubCategory) {
      filtered = filtered.filter((task) => task.Categories === selectedSubCategory);
    }
    if (budget) {
      filtered = filtered.filter((task) => task.amount <= budget);
    }
    if (category && from && to) {
      filtered = filtered.filter(
        (task) =>
          task.Categories === category &&
          task.from === from &&
          task.to === to
      );
    }

    setFilterTask(filtered);
  }, [tasks, route.params]);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => setSelectedTask(item)}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.row}>
            <Text variant="titleMedium">Category: {item.Categories}</Text>
            <Text variant="bodySmall">{item.daysLeft}</Text>
          </View>

          {item.Categories === "Transport" ? (
            <View style={styles.row}>
              <Text>From: {item.from || "N/A"}</Text>
              <Text>To: {item.to || "N/A"}</Text>
            </View>
          ) : (
            <Text>Sub Category: {item.SubCategory || "N/A"}</Text>
          )}

          <View style={styles.row}>
            <Text>Posted on: {new Date(item.createdAt).toLocaleDateString()}</Text>
            <Chip
              style={{
                backgroundColor: colors[index % colors.length],
              }}
              textStyle={{ color: "white" }}
            >
              ₹{item.amount}
            </Chip>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (selectedTask) {
    return (
      <AddTaskDetails
        task={selectedTask}
        documents={selectedTask.document}
        onBack={() => setSelectedTask(null)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Image source={HomeImage} style={styles.heroImage} />
      <View style={styles.overlay}>
        <Text style={styles.heroText}>Empowering Your</Text>
        <Text style={styles.heroText}>Vision, Building Your Future.</Text>
      </View>

      <Text variant="titleLarge" style={styles.title}>
        All Tasks
      </Text>

      <FlatList
        data={filterTask}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 50 }}
        ListEmptyComponent={<Text style={styles.emptyText}>Data Not Available</Text>}
      />
    </View>
  );
};

export default HomeScreen;
