import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { registerUser } from "@/pages/api/utils/endpoints";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function RegisterForm() {
    interface FormData {
        name: string;
        email: string;
        employee_id: string;
        password: string;
        user_type: string;
        role: string;
    }

    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        employee_id: "",
        password: "",
        user_type: "",
        role: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleDropdownChange = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await registerUser(formData);
            alert("User registered successfully!");
        } catch (error) {
            console.error("Registration failed:", error);
            alert("Registration failed. Please try again.");
        }
    };

    const userTypeOptions = [
        { value: "Employee", label: "Employee" },
        { value: "Management", label: "Management" },
    ];

    const roleOptions = [
        { value: "HR", label: "Human Resource Manager" },
        { value: "General Manager", label: "General Manager" },
        { value: "Assistant Quality Assurance Manager", label: "Assistant Quality Assurance Manager" },
        { value: "Procurement Manager", label: "Procurement Manager" },
        { value: "Quality and Compliance Manager", label: "Quality and Compliance Manager" },
        { value: "Logistician", label: "Logistician" },
        { value: "Accountant", label: "Accountant" },
        { value: "Production Supervisor", label: "Production Supervisor" },
        { value: "Inventory Supervisor", label: "Inventory Supervisor" },
        { value: "Production Manager", label: "Production Manager" },
        { value: "Production Support", label: "Production Support" },
        { value: "Janitor", label: "Janitor" },
        { value: "Security Guard", label: "Security Guard" },
        { value: "Managing Director", label: "Managing Director" },
        { value: "Director", label: "Director" },
    ];

    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Register User</CardTitle>
                <CardDescription>
                    Fill in the details below to create a new user account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="employee_id">Employee ID</Label>
                        <Input
                            id="employee_id"
                            type="text"
                            placeholder="Employee ID"
                            value={formData.employee_id}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Employee/Part of Management</Label>
                            <RadioGroup
                                value={formData.user_type}
                                onValueChange={(value) => handleDropdownChange("user_type", value)}
                            >
                                {userTypeOptions.map((option) => (
                                    <div key={option.value} className="flex items-center space-x-2">
                                        <RadioGroupItem value={option.value} id={option.value} />
                                        <Label htmlFor={option.value}>{option.label}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        {/*<DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full">
                                    {formData.user_type || "Select User Type"}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {userTypeOptions.map((option) => (
                                    <DropdownMenuItem
                                        key={option.value}
                                        onClick={() => handleDropdownChange("user_type", option.value)}
                                    >
                                        {option.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>*/}
                    </div>
                    <div className="grid gap-2">
                        <Label>Role</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full">
                                    {formData.role || "Select Role"}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {roleOptions
                                    .filter((option) =>
                                        formData.user_type === "Management"
                                            ? ["HR", "General Manager", "Managing Director", "Director"].includes(option.value)
                                            : !["HR", "General Manager", "Managing Director", "Director"].includes(option.value)
                                    )
                                    .map((option) => (
                                        <DropdownMenuItem
                                            key={option.value}
                                            onClick={() => handleDropdownChange("role", option.value)}
                                        >
                                            {option.label}
                                        </DropdownMenuItem>
                                    ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <Button type="submit" className="w-full">
                        Register
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}